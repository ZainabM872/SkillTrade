
const http = require('node:http');
const fs = require('node:fs');
const { Pool } = require('pg');
const { createRatingRoutes } = require('./ratings/routes');
const { createRatingSessionRoutes } = require('./ratings/sessions');
const { createAuthRoutes, isProtectedWrite } = require('./auth/routes');

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

// Frontend category keys mapped to database category names.
const CATEGORY_NAMES = {
  music: 'Music',
  sports: 'Sports & movement',
  food: 'Food & drink',
  art: 'Art',
  languages: 'Languages',
  technology: 'Technology',
  other: 'Other',
};

// Frontend weekday abbreviations mapped to database values.
const DAY_NUMBERS = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

function sendJson(res, status, data) {
  res.writeHead(status);
  res.end(JSON.stringify(data));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;

      if (body.length > 100_000) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON request body.'));
      }
    });

    req.on('error', reject);
  });
}

// GET /api/listings
// Returns active listings for the Explore page.
async function getListings(res) {
  try {
    const result = await pool.query(`
      SELECT l.listing_id, l.title, l.description, l.session_mode,
             l.duration_minutes, l.point_cost, u.name AS teacher_name,
             c.name AS category
      FROM skilltrade.skill_listings l
      JOIN skilltrade.users u ON u.user_id = l.teacher_id
      JOIN skilltrade.categories c ON c.category_id = l.category_id
      WHERE l.status = 'active' AND u.account_status = 'active'
      ORDER BY l.listing_id
    `);

    sendJson(res, 200, result.rows);
  } catch (error) {
    console.error('Could not load listings:', error.message);
    sendJson(res, 503, {
      error: 'Listings are unavailable. Please try again.',
    });
  }
}

// POST /api/listings
// Saves a new listing, its locations, and weekly availability.
async function createListing(req, res) {
  let client;

  try {
    const body = await readRequestBody(req);

    const {
      teacher_id,
      title,
      description,
      category,
      difficulty,
      experience_level,
      format,
      duration_minutes,
      point_cost,
      availability,
      meetingLocations,
    } = body;

    // Validate required information.
    if (
      !Number.isInteger(Number(teacher_id)) ||
      !title?.trim() ||
      !CATEGORY_NAMES[category] ||
      !['online', 'both', 'in-person'].includes(format) ||
      !Number.isInteger(Number(duration_minutes)) ||
      Number(duration_minutes) <= 0 ||
      !Number.isFinite(Number(point_cost)) ||
      Number(point_cost) <= 0 ||
      !availability ||
      typeof availability !== 'object' ||
      !Array.isArray(meetingLocations) ||
      meetingLocations.length === 0
    ) {
      return sendJson(res, 400, {
        error: 'Please provide valid listing information.',
      });
    }

    const teacherId = Number(teacher_id);
    const duration = Number(duration_minutes);
    const points = Number(point_cost);

    const sessionMode = format === 'in-person'
      ? 'in_person'
      : format;

    const categoryName = CATEGORY_NAMES[category];

    // Start a transaction so all listing data saves together.
    client = await pool.connect();
    await client.query('BEGIN');

    // Confirm the teacher exists and is active.
    const teacherResult = await client.query(
      `SELECT user_id
       FROM skilltrade.users
       WHERE user_id = $1 AND account_status = 'active'`,
      [teacherId]
    );

    if (teacherResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return sendJson(res, 400, {
        error: 'The selected teacher does not exist or is inactive.',
      });
    }

    // Find the database category ID.
    const categoryResult = await client.query(
      `SELECT category_id
       FROM skilltrade.categories
       WHERE name = $1 AND active = true`,
      [categoryName]
    );

    if (categoryResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return sendJson(res, 400, {
        error: 'The selected category is unavailable.',
      });
    }

    const categoryId = categoryResult.rows[0].category_id;

    // Insert the listing as active so Explore can display it.
    const listingResult = await client.query(
      `INSERT INTO skilltrade.skill_listings
        (teacher_id, category_id, title, description,
         experience_level, difficulty, session_mode,
         duration_minutes, point_cost, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active')
       RETURNING listing_id`,
      [
        teacherId,
        categoryId,
        title.trim(),
        description?.trim() || null,
        experience_level || null,
        difficulty || null,
        sessionMode,
        duration,
        points,
      ]
    );

    const listingId = listingResult.rows[0].listing_id;

    // Save meeting locations and connect them to the listing.
    for (const location of meetingLocations) {
      if (!location.name?.trim()) {
        throw new Error('Every meeting location needs a name.');
      }

      const locationResult = await client.query(
        `INSERT INTO skilltrade.locations
          (created_by, location_name, meeting_instructions)
         VALUES ($1, $2, $3)
         RETURNING location_id`,
        [
          teacherId,
          location.name.trim(),
          location.details?.trim() || null,
        ]
      );

      await client.query(
        `INSERT INTO skilltrade.listing_locations
          (listing_id, location_id)
         VALUES ($1, $2)`,
        [listingId, locationResult.rows[0].location_id]
      );
    }

    // Save recurring weekly availability.
    for (const [day, times] of Object.entries(availability)) {
      const dayNumber = DAY_NUMBERS[day];

      if (dayNumber === undefined || !Array.isArray(times)) {
        throw new Error('Invalid availability information.');
      }

      for (const time of times) {
        await client.query(
          `INSERT INTO skilltrade.listing_availability
            (listing_id, day_of_week, start_time)
           VALUES ($1, $2, $3)`,
          [listingId, dayNumber, time]
        );
      }
    }

    await client.query('COMMIT');

    sendJson(res, 201, {
      message: 'Listing published successfully.',
      listing_id: listingId,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }

    console.error('Could not publish listing:', error.message);

    sendJson(res, 500, {
      error: 'Could not publish your listing. Please try again.',
    });
  } finally {
    if (client) client.release();
  }
}

const { authenticate, handleAuthRequest } = createAuthRoutes({ pool });
const handleRatingRequest = createRatingRoutes({ pool, authenticate, isProtectedWrite });
const handleRatingSessionRequest = createRatingSessionRoutes({ pool, authenticate });

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  const url = new URL(req.url, 'http://localhost');

  if (await handleAuthRequest(req, res, url.pathname)) return;
  if (await handleRatingSessionRequest(req, res, url.pathname)) return;
  if (await handleRatingRequest(req, res, url.pathname)) return;

  if (url.pathname === '/api/listings' && req.method === 'GET') {
    return getListings(res);
  }

  if (url.pathname === '/api/listings' && req.method === 'POST') {
    return createListing(req, res);
  }

  sendJson(res, 404, { error: 'Not found.' });
});

// Add only our login-session table; existing tables and records are left unchanged.
pool.query(fs.readFileSync(require('node:path').join(__dirname, 'auth/schema.sql'), 'utf8'))
  .then(() => server.listen(Number(process.env.PORT || 3001), '0.0.0.0', () => {
    console.log('SkillTrade API is running.');
  }))
  .catch(error => {
    console.error('Could not prepare login sessions:', error.message);
    pool.end();
    process.exitCode = 1;
  });

process.on('SIGTERM', () => {
  server.close(() => pool.end());
});
