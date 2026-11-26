const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createRatingSessionRoutes } = require('./sessions');

async function request(t, options = {}) {
  const queries = [];
  const rows = options.rows || [{ session_id: '1', skill: 'Photography basics', partner: 'Alex' }];
  const handler = createRatingSessionRoutes({
    authenticate: async () => options.unauthenticated ? null : { userId: '2' },
    pool: { async query(sql, values) {
      queries.push({ sql, values });
      if (options.databaseError) throw new Error('private SQL detail');
      return { rows };
    } },
  });
  const server = http.createServer(async (req, res) => {
    if (!await handler(req, res, new URL(req.url, 'http://localhost').pathname)) { res.writeHead(404); res.end('{}'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}${options.path || '/api/rating-sessions'}`, { method: options.method || 'GET' });
  return { status: response.status, data: await response.json(), queries, allow: response.headers.get('allow') };
}

test('completed-session list uses verified identity, participant filter, and database status', async t => {
  const result = await request(t);
  assert.equal(result.status, 200);
  assert.equal(result.data.sessions[0].session_id, '1');
  assert.deepEqual(result.queries[0].values, ['2']);
  assert.match(result.queries[0].sql, /teacher_id = \$1 OR s.learner_id = \$1/);
  assert.match(result.queries[0].sql, /s.status = 'completed'/);
  assert.doesNotMatch(result.queries[0].sql, /INSERT|UPDATE|DELETE/);
});

test('single lookup uses both authenticated ID and supplied session ID', async t => {
  const result = await request(t, { path: '/api/rating-sessions/1' });
  assert.equal(result.status, 200);
  assert.deepEqual(result.queries[0].values, ['2', '1']);
  assert.match(result.queries[0].sql, /s.session_id = \$2/);
});

test('unauthenticated requests cannot see the session list', async t => {
  const result = await request(t, { unauthenticated: true });
  assert.equal(result.status, 401);
  assert.equal(result.queries.length, 0);
});

for (const id of ['ses_001', '0', '9223372036854775808']) {
  test(`invalid ID ${id} never queries the database`, async t => {
    const result = await request(t, { path: `/api/rating-sessions/${id}` });
    assert.equal(result.status, 400);
    assert.equal(result.queries.length, 0);
  });
}

test('missing, incomplete, and other-account sessions share a not-found response', async t => {
  const result = await request(t, { path: '/api/rating-sessions/1', rows: [] });
  assert.equal(result.status, 404);
  assert.deepEqual(result.data, { error: 'Completed session not found for this account.' });
});

test('no completed sessions returns an empty list', async t => {
  const result = await request(t, { rows: [] });
  assert.deepEqual(result.data, { sessions: [] });
});

test('session endpoints cannot create or complete a booking', async t => {
  const result = await request(t, { method: 'POST' });
  assert.equal(result.status, 405);
  assert.equal(result.allow, 'GET');
  assert.equal(result.queries.length, 0);
});

test('database failures do not expose SQL details', async t => {
  const result = await request(t, { databaseError: true });
  assert.equal(result.status, 503);
  assert.doesNotMatch(JSON.stringify(result.data), /private SQL detail/);
});
