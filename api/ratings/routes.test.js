const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createRatingRoutes } = require('./routes');

// Exercise real HTTP parsing and responses without changing the shared database.
async function request(t, options = {}) {
  const queries = [];
  let released = false;
  const client = {
    async query(sql, values) {
      queries.push({ sql, values });
      if (options.databaseError) throw new Error('private database detail');
      if (sql.includes('FROM skilltrade.users')) return { rows: options.inactive ? [] : [{ user_id: '2' }] };
      if (sql.includes('FROM skilltrade.sessions')) return { rows: options.missing ? [] : [{ teacher_id: '1', learner_id: '2', status: options.status || 'completed' }] };
      if (sql.includes('skilltrade.reviews')) return { rows: options.noReview ? [] : [{ review_id: '9', session_id: '3', rating: 4, comment: 'Helpful', status: 'visible' }] };
      return { rows: [] };
    },
    release() { released = true; },
  };
  const dependencies = { pool: { async connect() { return client; } } };
  // This is a test double for future verified authentication, not a deployed login.
  if (!options.unauthenticated) dependencies.authenticate = async () => ({ userId: options.userId || '2' });
  const handler = createRatingRoutes(dependencies);
  const server = http.createServer(async (req, res) => {
    if (!await handler(req, res, new URL(req.url, 'http://localhost').pathname)) {
      res.writeHead(404); res.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}${options.path || '/api/sessions/3/rating'}`, {
    method: options.method || 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-SkillTrade-Request': '1', ...(options.headers || {}) },
    body: options.method === 'GET' ? undefined : options.body ?? JSON.stringify({ rating: 4, comment: ' Helpful ' }),
  });
  const data = response.status === 404 && options.path === '/api/listings' ? null : await response.json();
  return { response, data, queries, released };
}

test('default authentication rejects requests, even with a forged identity header', async t => {
  const result = await request(t, { unauthenticated: true, headers: { 'X-User-Id': '2', Authorization: 'Bearer fake' } });
  assert.equal(result.response.status, 401);
  assert.equal(result.queries.length, 0);
});

test('saves feedback using the authenticated reviewer and session partner', async t => {
  const result = await request(t);
  assert.equal(result.response.status, 200);
  const insert = result.queries.find(q => q.sql.includes('INSERT INTO'));
  assert.deepEqual(insert.values, ['3', '2', '1', 4, 'Helpful']);
  assert.match(insert.sql, /ON CONFLICT/);
  assert.equal(result.queries.at(-1).sql, 'COMMIT');
  assert.equal(result.released, true);
});

test('teachers rate the learner instead of themselves', async t => {
  const result = await request(t, { userId: '1' });
  assert.equal(result.queries.find(q => q.sql.includes('INSERT INTO')).values[2], '2');
});

for (const body of ['{', 'null', '[]', '{"rating":0}', '{"rating":6}', '{"rating":2.5}', '{"rating":"4"}', '{"rating":4,"comment":null}', '{"rating":4,"reviewer_id":1}', JSON.stringify({ rating: 4, comment: 'a'.repeat(501) })]) {
  test(`rejects invalid feedback: ${body.slice(0, 65)}`, async t => {
    const result = await request(t, { body });
    assert.equal(result.response.status, 400);
    assert.equal(result.queries.length, 0);
  });
}

test('rejects oversized bodies before connecting to the database', async t => {
  const result = await request(t, { body: 'x'.repeat(10001) });
  assert.equal(result.response.status, 413);
  assert.equal(result.queries.length, 0);
});

for (const id of ['ses_001', '0', '-1', '9223372036854775808']) {
  test(`rejects non-database session ID ${id}`, async t => {
    const result = await request(t, { path: `/api/sessions/${id}/rating` });
    assert.equal(result.response.status, 400);
    assert.equal(result.queries.length, 0);
  });
}

for (const [options, status] of [[{ missing: true }, 404], [{ inactive: true }, 403], [{ status: 'confirmed' }, 409], [{ noReview: true }, 409]]) {
  test(`rejects inaccessible or uneditable sessions/reviews: ${JSON.stringify(options)}`, async t => {
    const result = await request(t, options);
    assert.equal(result.response.status, status);
    assert.equal(result.queries.at(-1).sql, 'ROLLBACK');
    assert.equal(result.released, true);
  });
}

test('loads only the authenticated participant’s review', async t => {
  const result = await request(t, { method: 'GET' });
  assert.equal(result.response.status, 200);
  const select = result.queries.find(q => q.sql.includes('FROM skilltrade.reviews'));
  assert.deepEqual(select.values, ['3', '2']);
  assert.equal(result.data.review.rating, 4);
});

test('returns null when a participant has not rated yet', async t => {
  const result = await request(t, { method: 'GET', noReview: true });
  assert.deepEqual(result.data, { review: null });
});

test('database failures do not expose internal details and release the connection', async t => {
  const result = await request(t, { databaseError: true });
  assert.equal(result.response.status, 500);
  assert.doesNotMatch(JSON.stringify(result.data), /private database detail/);
  assert.equal(result.released, true);
});

test('unrelated routes remain outside the rating handler', async t => {
  const result = await request(t, { method: 'GET', path: '/api/listings' });
  assert.equal(result.response.status, 404);
  assert.equal(result.queries.length, 0);
});

test('unsupported methods return the allowed methods', async t => {
  const result = await request(t, { method: 'POST' });
  assert.equal(result.response.status, 405);
  assert.equal(result.response.headers.get('allow'), 'GET, PUT');
});
