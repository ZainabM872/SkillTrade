const http = require('node:http');
const fs = require('node:fs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'db',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'skilltrade_db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD_FILE
    ? fs.readFileSync(process.env.PGPASSWORD_FILE, 'utf8').trim()
    : process.env.PGPASSWORD,
  connectionTimeoutMillis: 5000,
  statement_timeout: 5000,
  max: 5,
});

pool.on('error', () => console.error('Database connection lost.'));

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' || req.url !== '/api/listings') {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found.' }));
    return;
  }

  try {
    const result = await pool.query(`
      SELECT l.listing_id, l.title, l.description, l.session_mode,
             l.duration_minutes, l.point_cost, u.name AS teacher_name
      FROM skilltrade.skill_listings l
      JOIN skilltrade.users u ON u.user_id = l.teacher_id
      WHERE l.status = 'active' AND u.account_status = 'active'
      ORDER BY l.listing_id
    `);
    res.end(JSON.stringify(result.rows));
  } catch {
    console.error('Could not load listings from the database.');
    res.writeHead(503);
    res.end(JSON.stringify({ error: 'Listings are unavailable. Please try again.' }));
  }
});

server.listen(Number(process.env.PORT || 3001), '0.0.0.0', () => {
  console.log('SkillTrade API is running.');
});

process.on('SIGTERM', () => {
  server.close(() => pool.end());
});
