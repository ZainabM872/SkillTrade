const { randomBytes, createHash } = require('node:crypto');
const argon2 = require('argon2');

const COOKIE_NAME = 'skilltrade_session';
const SESSION_SECONDS = 8 * 60 * 60;
const hashToken = token => createHash('sha256').update(token).digest('hex');

// A custom header prevents cross-site forms from making cookie-authenticated writes.
// Do not enable cross-origin credentials/CORS without revisiting this protection.
function isProtectedWrite(req) {
  return req.headers['x-skilltrade-request'] === '1';
}

function createAuthRoutes({ pool, secureCookies = process.env.AUTH_COOKIE_SECURE === 'true' }) {
  const attempts = new Map();
  let activeChecks = 0;
  // Unknown accounts still perform password verification, reducing timing differences.
  const dummyHash = argon2.hash(randomBytes(32));

  function send(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
  }

  function cookie(token, maxAge = SESSION_SECONDS) {
    return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${maxAge}${secureCookies ? '; Secure' : ''}`;
  }

  function readToken(req) {
    const cookies = (req.headers.cookie || '').split(';').map(value => value.trim());
    const matches = cookies.filter(value => value.startsWith(`${COOKIE_NAME}=`));
    if (matches.length !== 1) return null;
    const token = matches[0].slice(COOKIE_NAME.length + 1);
    return /^[a-f0-9]{64}$/.test(token) ? token : null;
  }

  async function authenticate(req) {
    const token = readToken(req);
    if (!token) return null;
    const result = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.role FROM skilltrade.login_sessions s
       JOIN skilltrade.users u ON u.user_id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > now() AND u.account_status = 'active'`,
      [hashToken(token)]
    );
    const user = result.rows[0];
    return user ? { userId: String(user.user_id), name: user.name, email: user.email, role: user.role } : null;
  }

  function allowAttempt(req, email) {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
    const keys = [`ip:${req.socket.remoteAddress}`, `email:${hashToken(email)}`];
    if (attempts.size > 10000 || activeChecks >= 4) return false;
    for (const key of keys) {
      if ((attempts.get(key)?.count || 0) >= 20) return false;
    }
    for (const key of keys) {
      const previous = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
      attempts.set(key, { ...previous, count: previous.count + 1 });
    }
    return true;
  }

  async function handleAuthRequest(req, res, pathname) {
    if (!['/api/auth/login', '/api/auth/me', '/api/auth/logout'].includes(pathname)) return false;
    const expectedMethod = pathname === '/api/auth/me' ? 'GET' : 'POST';
    if (req.method !== expectedMethod) {
      res.setHeader('Allow', expectedMethod);
      send(res, 405, { error: `Use ${expectedMethod} for this endpoint.` });
      return true;
    }
    if (req.method === 'POST' && !isProtectedWrite(req)) {
      send(res, 403, { error: 'Please submit this request from SkillTrade.' });
      return true;
    }
    try {
      if (pathname === '/api/auth/me') {
        const user = await authenticate(req);
        send(res, user ? 200 : 401, user ? { user } : { error: 'Please log in.' });
      } else if (pathname === '/api/auth/logout') {
        const token = readToken(req);
        if (token) await pool.query('DELETE FROM skilltrade.login_sessions WHERE token_hash = $1', [hashToken(token)]);
        res.setHeader('Set-Cookie', cookie('', 0));
        send(res, 200, { message: 'Logged out.' });
      } else {
        let raw = '';
        let size = 0;
        for await (const chunk of req) {
          size += Buffer.byteLength(chunk);
          if (size > 10000) {
            send(res, 413, { error: 'Login request is too large.' });
            return true;
          }
          raw += chunk;
        }
        let data;
        try { data = JSON.parse(raw); }
        catch { send(res, 400, { error: 'Send valid JSON.' }); return true; }
        if (!data || typeof data.email !== 'string' || typeof data.password !== 'string'
          || data.email.trim().length > 150 || !data.email.trim().includes('@')
          || !data.password.length || data.password.length > 1024) {
          send(res, 400, { error: 'Enter your email and password.' });
          return true;
        }
        const email = data.email.trim().toLowerCase();
        if (!allowAttempt(req, email)) {
          res.setHeader('Retry-After', '900');
          send(res, 429, { error: 'Too many login attempts. Please try again in 15 minutes.' });
          return true;
        }
        activeChecks += 1;
        try {
          const result = await pool.query(
            'SELECT user_id, name, email, role, password_hash, account_status FROM skilltrade.users WHERE lower(email) = $1', [email]
          );
          const user = result.rows[0];
          let matches = false;
          try { matches = await argon2.verify(user?.password_hash || await dummyHash, data.password); }
          catch { /* Invalid legacy hashes must never authenticate an account. */ }
          if (!matches || !user || user.account_status !== 'active') {
            send(res, 401, { error: 'Email or password is incorrect.' });
            return true;
          }
          const token = randomBytes(32).toString('hex');
          // Only a hash of the random cookie token is stored in PostgreSQL.
          await pool.query(
            `INSERT INTO skilltrade.login_sessions (token_hash, user_id, expires_at)
             VALUES ($1, $2, now() + interval '8 hours')`, [hashToken(token), user.user_id]
          );
          // Rotate an existing session after successful login.
          const oldToken = readToken(req);
          if (oldToken) await pool.query('DELETE FROM skilltrade.login_sessions WHERE token_hash = $1', [hashToken(oldToken)]);
          res.setHeader('Set-Cookie', cookie(token));
          send(res, 200, { user: { userId: String(user.user_id), name: user.name, email: user.email, role: user.role } });
        } finally { activeChecks -= 1; }
      }
    } catch (error) {
      console.error('Authentication request failed:', error.message);
      send(res, 503, { error: 'Login is temporarily unavailable. Please try again.' });
    }
    return true;
  }
  return { authenticate, handleAuthRequest };
}

module.exports = { createAuthRoutes, isProtectedWrite };
