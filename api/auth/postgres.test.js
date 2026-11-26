const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { Pool } = require('pg');
const argon2 = require('argon2');
const { createAuthRoutes } = require('./routes');
const { createRatingRoutes } = require('../ratings/routes');
const { createRatingSessionRoutes } = require('../ratings/sessions');

// Run only against a disposable copy of schema.sql + seed.sql, never a shared DB.
test('PostgreSQL: login, rate, restart handlers, read, edit, logout', {
  skip: !process.env.SKILLTRADE_TEST_DATABASE,
}, async t => {
  const database = process.env.SKILLTRADE_TEST_DATABASE;
  assert.match(database, /^skilltrade_auth_test_\d+$/);
  const pool = new Pool({
    host: process.env.PGHOST || '127.0.0.1', port: Number(process.env.PGPORT || 3307),
    user: process.env.PGUSER || 'postgres', database,
    password: process.env.PGPASSWORD_FILE ? fs.readFileSync(process.env.PGPASSWORD_FILE, 'utf8').trim() : process.env.PGPASSWORD,
  });
  t.after(() => pool.end());
  await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  const password = 'isolated-test-only';
  await pool.query('UPDATE skilltrade.users SET password_hash=$1 WHERE user_id=2', [await argon2.hash(password)]);
  let auth;
  let ratings;
  let ratingSessions;
  function restartHandlers() {
    auth = createAuthRoutes({ pool });
    ratings = createRatingRoutes({ pool, authenticate: auth.authenticate });
    ratingSessions = createRatingSessionRoutes({ pool, authenticate: auth.authenticate });
  }
  restartHandlers();
  const server = http.createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (await auth.handleAuthRequest(req, res, pathname)) return;
    if (await ratingSessions(req, res, pathname)) return;
    if (await ratings(req, res, pathname)) return;
    res.writeHead(404); res.end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  let cookie = '';
  async function request(url, method = 'GET', body) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${url}`, {
      method, headers: { 'Content-Type': 'application/json', 'X-SkillTrade-Request': '1', Cookie: cookie },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    assert.equal(response.status, 200, JSON.stringify(data));
    if (response.headers.has('set-cookie')) cookie = response.headers.get('set-cookie').split(';')[0];
    return data;
  }
  await request('/api/auth/login', 'POST', { email: 'sam@example.com', password });
  const completed = await request('/api/rating-sessions');
  assert.deepEqual(completed.sessions.map(item => String(item.session_id)), ['1']);
  const details = await request('/api/rating-sessions/1');
  assert.equal(details.session.partner, 'Alex');
  assert.equal(details.session.skill, 'Photography basics');
  await request('/api/sessions/1/rating', 'PUT', { rating: 5, comment: 'Persisted feedback' });
  restartHandlers();
  assert.equal((await request('/api/auth/me')).user.userId, '2');
  assert.equal((await request('/api/sessions/1/rating')).review.comment, 'Persisted feedback');
  await request('/api/sessions/1/rating', 'PUT', { rating: 4, comment: 'Edited feedback' });
  const stored = await pool.query('SELECT rating, comment FROM skilltrade.reviews WHERE session_id=1 AND reviewer_id=2');
  assert.deepEqual(stored.rows, [{ rating: 4, comment: 'Edited feedback' }]);
  await request('/api/auth/logout', 'POST');
  assert.equal((await pool.query('SELECT count(*) FROM skilltrade.login_sessions')).rows[0].count, '0');
});
