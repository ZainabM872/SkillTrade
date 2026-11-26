// Read-only session lookup for ratings. Booking creation and completion stay separate.
function createRatingSessionRoutes({ pool, authenticate }) {
  return async function handleRatingSessionRequest(req, res, pathname) {
    const match = /^\/api\/rating-sessions(?:\/([^/]+))?$/.exec(pathname);
    if (!match) return false;
    function send(status, data) {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(data));
    }
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      send(405, { error: 'Session lookup is read-only.' });
      return true;
    }
    try {
      const user = await authenticate(req);
      if (!user) { send(401, { error: 'Please log in to view your completed sessions.' }); return true; }
      const sessionId = match[1];
      if (sessionId && (!/^[1-9]\d{0,18}$/.test(sessionId) || BigInt(sessionId) > 9223372036854775807n)) {
        send(400, { error: 'A real database session ID is required.' }); return true;
      }
      const result = await pool.query(
        `SELECT s.session_id, s.status, s.start_time, s.end_time, s.mode,
                s.point_cost, l.title AS skill, partner.name AS partner,
                CASE WHEN s.teacher_id = $1 THEN 'Learner' ELSE 'Teacher' END AS partner_role,
                round(extract(epoch FROM (s.end_time - s.start_time)) / 60)::integer AS duration_minutes
         FROM skilltrade.sessions s
         JOIN skilltrade.skill_listings l ON l.listing_id = s.listing_id
         JOIN skilltrade.users partner ON partner.user_id =
           CASE WHEN s.teacher_id = $1 THEN s.learner_id ELSE s.teacher_id END
         WHERE (s.teacher_id = $1 OR s.learner_id = $1)
           AND s.status = 'completed'
           ${sessionId ? 'AND s.session_id = $2' : ''}
         ORDER BY s.start_time DESC, s.session_id DESC`,
        sessionId ? [user.userId, sessionId] : [user.userId]
      );
      if (sessionId) {
        if (!result.rows.length) send(404, { error: 'Completed session not found for this account.' });
        else send(200, { session: result.rows[0] });
      } else send(200, { sessions: result.rows });
    } catch (error) {
      console.error('Could not load rating sessions:', error.message);
      send(503, { error: 'Could not load your completed sessions. Please try again.' });
    }
    return true;
  };
}
module.exports = { createRatingSessionRoutes };
