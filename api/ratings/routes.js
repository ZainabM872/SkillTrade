// Authentication is supplied by the shared server, never by a user ID in JSON.
// Until real login is connected, the default deliberately rejects every request.
function createRatingRoutes({ pool, authenticate = async () => null, isProtectedWrite = req => req.headers['x-skilltrade-request'] === '1' }) {
  function send(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
  }

  function validId(value) {
    return typeof value === 'string' && /^[1-9]\d{0,18}$/.test(value)
      && BigInt(value) <= 9223372036854775807n;
  }

  async function readFeedback(req) {
    let body = '';
    let size = 0;
    for await (const chunk of req) {
      size += Buffer.byteLength(chunk);
      if (size > 10000) throw Object.assign(new Error('Request is too large.'), { status: 413 });
      body += chunk;
    }
    let data;
    try { data = JSON.parse(body); }
    catch { throw Object.assign(new Error('Send valid JSON.'), { status: 400 }); }
    if (!data || typeof data !== 'object' || Array.isArray(data)
      || Object.keys(data).some(key => !['rating', 'comment'].includes(key))
      || !Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5
      || (data.comment !== undefined && typeof data.comment !== 'string')
      || (data.comment || '').length > 500) {
      throw Object.assign(new Error('Choose a rating from 1 to 5 and a comment of up to 500 characters. Only rating and comment are accepted.'), { status: 400 });
    }
    return { rating: data.rating, comment: (data.comment || '').trim() };
  }

  return async function handleRatingRequest(req, res, pathname) {
    const match = /^\/api\/sessions\/([^/]+)\/rating$/.exec(pathname);
    if (!match) return false;
    if (!['GET', 'PUT'].includes(req.method)) {
      res.setHeader('Allow', 'GET, PUT');
      send(res, 405, { error: 'Use GET to read or PUT to save a rating.' });
      return true;
    }

    let client;
    let inTransaction = false;
    try {
      const user = await authenticate(req);
      // The authentication adapter must return a verified database user ID as a string.
      if (!user || !validId(user.userId)) {
        send(res, 401, { error: 'Sign in with an authenticated account to rate a session.' });
        return true;
      }
      if (req.method === 'PUT' && !isProtectedWrite(req)) {
        send(res, 403, { error: 'Please submit this request from SkillTrade.' });
        return true;
      }
      const sessionId = match[1];
      if (!validId(sessionId)) {
        send(res, 400, { error: 'A real database session ID is required.' });
        return true;
      }
      const feedback = req.method === 'PUT' ? await readFeedback(req) : null;
      client = await pool.connect();
      await client.query('BEGIN');
      inTransaction = true;
      const account = await client.query(
        'SELECT user_id FROM skilltrade.users WHERE user_id = $1 AND account_status = $2 FOR SHARE',
        [user.userId, 'active']
      );
      if (!account.rows.length) {
        send(res, 403, { error: 'An active account is required.' });
        return true;
      }
      const result = await client.query(
        `SELECT teacher_id, learner_id, status FROM skilltrade.sessions
         WHERE session_id = $1 AND (teacher_id = $2 OR learner_id = $2) FOR SHARE`,
        [sessionId, user.userId]
      );
      const session = result.rows[0];
      // Use the same response for missing sessions and sessions belonging to others.
      if (!session) {
        send(res, 404, { error: 'Session not found for this account.' });
        return true;
      }
      if (req.method === 'PUT' && session.status !== 'completed') {
        send(res, 409, { error: 'You can rate a session after it is completed.' });
        return true;
      }

      let saved;
      if (req.method === 'GET') {
        saved = await client.query(
          `SELECT review_id, session_id, rating, comment, status FROM skilltrade.reviews
           WHERE session_id = $1 AND reviewer_id = $2`, [sessionId, user.userId]
        );
      } else {
        const partnerId = String(session.teacher_id) === user.userId
          ? session.learner_id : session.teacher_id;
        // One review per person per session. Repeating PUT updates that same review.
        // A user cannot make a moderator-hidden review visible again by editing it.
        saved = await client.query(
          `INSERT INTO skilltrade.reviews (session_id, reviewer_id, reviewee_id, rating, comment)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (session_id, reviewer_id) DO UPDATE
           SET rating = EXCLUDED.rating, comment = EXCLUDED.comment
           WHERE reviews.status = 'visible'
           RETURNING review_id, session_id, rating, comment, status`,
          [sessionId, user.userId, partnerId, feedback.rating, feedback.comment]
        );
        if (!saved.rows.length) {
          send(res, 409, { error: 'This review has been hidden by a moderator and cannot be edited.' });
          return true;
        }
      }
      await client.query('COMMIT');
      inTransaction = false;
      send(res, 200, { review: saved.rows[0] || null });
    } catch (error) {
      if (!error.status) console.error('Could not process session rating:', error.message);
      send(res, error.status || 500, { error: error.status ? error.message : 'Could not save or load your rating. Please try again.' });
    } finally {
      if (client) {
        if (inTransaction) await client.query('ROLLBACK').catch(() => {});
        client.release();
      }
    }
    return true;
  };
}

module.exports = { createRatingRoutes };
