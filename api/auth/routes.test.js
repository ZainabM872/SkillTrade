const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const argon2 = require('argon2');
const { createAuthRoutes } = require('./routes');

const password = 'only-a-test-password';
const passwordHash = argon2.hash(password);

async function setup(t, options = {}) {
  const sessions = new Map();
  const queries = [];
  const user = { user_id: '2', name: 'Sam', email: 'sam@example.com', role: 'student', account_status: options.inactive ? 'restricted' : 'active', password_hash: await passwordHash };
  const pool = {
    async query(sql, values) {
      queries.push({ sql, values });
      if (options.databaseError) throw new Error('private SQL detail');
      if (sql.startsWith('SELECT user_id')) return { rows: values[0] === user.email ? [user] : [] };
      if (sql.includes('INSERT INTO skilltrade.login_sessions')) sessions.set(values[0], values[1]);
      if (sql.includes('DELETE FROM skilltrade.login_sessions')) sessions.delete(values[0]);
      if (sql.includes('JOIN skilltrade.users')) return { rows: sessions.has(values[0]) && !options.expired && user.account_status === 'active' ? [user] : [] };
      return { rows: [] };
    },
    async connect() {
      return {
        async query(sql, values) {
          queries.push({ sql, values });
          if (sql.includes('FROM skilltrade.users')) return { rows: [user] };
          if (sql.includes('FROM skilltrade.sessions')) return { rows: [{ teacher_id: '1', learner_id: '2', status: 'completed' }] };
          if (sql.includes('INSERT INTO skilltrade.reviews')) return { rows: [{ review_id: '1', rating: values[3] }] };
          return { rows: [] };
        }, release() {},
      };
    },
  };
  const auth = createAuthRoutes({ pool, secureCookies: true });
  const server = http.createServer(async (req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (await auth.handleAuthRequest(req, res, path)) return;
    res.writeHead(404); res.end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  async function request(path, { body, cookie, method = body ? 'POST' : 'GET', protectedWrite = true } = {}) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, {
      method, headers: {
        'Content-Type': 'application/json',
        ...(protectedWrite ? { 'X-SkillTrade-Request': '1' } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      }, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    });
    return { status: response.status, cookie: response.headers.get('set-cookie'), data: await response.json() };
  }
  return { request, sessions, queries };
}

test('real Argon2 login creates a hashed server session, identifies user, and logs out', async t => {
  const { request, sessions } = await setup(t);
  const login = await request('/api/auth/login', { body: { email: ' SAM@example.com ', password } });
  assert.equal(login.status, 200);
  assert.equal(login.data.user.userId, '2');
  assert.equal(login.data.user.password_hash, undefined);
  assert.match(login.cookie, /HttpOnly; SameSite=Strict; Path=\/api; Max-Age=28800; Secure/);
  const cookie = login.cookie.split(';')[0];
  assert.equal(sessions.has(cookie.split('=')[1]), false);
  assert.equal(sessions.size, 1);
  assert.equal((await request('/api/auth/me', { cookie })).status, 200);
  assert.equal((await request('/api/auth/logout', { method: 'POST', cookie })).status, 200);
  assert.equal((await request('/api/auth/me', { cookie })).status, 401);
});

for (const options of [{}, { inactive: true }]) {
  test(`unknown user, wrong password and restricted account cannot log in: ${JSON.stringify(options)}`, async t => {
    const { request, sessions } = await setup(t, options);
    for (const body of [{ email: 'unknown@example.com', password }, { email: 'sam@example.com', password: 'wrong' }, ...(options.inactive ? [{ email: 'sam@example.com', password }] : [])]) {
      const result = await request('/api/auth/login', { body });
      assert.equal(result.status, 401);
      assert.deepEqual(result.data, { error: 'Email or password is incorrect.' });
    }
    assert.equal(sessions.size, 0);
  });
}

test('login rotation revokes the old cookie', async t => {
  const { request } = await setup(t);
  const first = await request('/api/auth/login', { body: { email: 'sam@example.com', password } });
  const oldCookie = first.cookie.split(';')[0];
  const second = await request('/api/auth/login', { body: { email: 'sam@example.com', password }, cookie: oldCookie });
  assert.notEqual(first.cookie, second.cookie);
  assert.equal((await request('/api/auth/me', { cookie: oldCookie })).status, 401);
});

test('missing, malformed and expired sessions cannot authenticate', async t => {
  const { request } = await setup(t, { expired: true });
  const login = await request('/api/auth/login', { body: { email: 'sam@example.com', password } });
  for (const cookie of [undefined, 'skilltrade_session=2', login.cookie.split(';')[0]]) {
    assert.equal((await request('/api/auth/me', { cookie })).status, 401);
  }
});

test('cross-site form requests cannot log in or log out', async t => {
  const { request } = await setup(t);
  for (const path of ['/api/auth/login', '/api/auth/logout']) {
    assert.equal((await request(path, { method: 'POST', protectedWrite: false })).status, 403);
  }

});

test('malformed and oversized requests do not create sessions', async t => {
  const { request, sessions } = await setup(t);
  for (const body of ['{', 'null', '{}']) {
    assert.equal((await request('/api/auth/login', { body })).status, 400);
  }
  assert.equal((await request('/api/auth/login', { body: 'x'.repeat(10001) })).status, 413);
  assert.equal(sessions.size, 0);
});

test('repeated login attempts are throttled', async t => {
  const { request } = await setup(t);
  for (let i = 0; i < 20; i += 1) {
    assert.equal((await request('/api/auth/login', { body: { email: 'sam@example.com', password: 'wrong' } })).status, 401);
  }
  assert.equal((await request('/api/auth/login', { body: { email: 'sam@example.com', password } })).status, 429);
});

test('database failures return a retry message without internal details', async t => {
  const { request } = await setup(t, { databaseError: true });
  const result = await request('/api/auth/login', { body: { email: 'sam@example.com', password } });
  assert.equal(result.status, 503);
  assert.doesNotMatch(JSON.stringify(result.data), /SQL detail/);
});
