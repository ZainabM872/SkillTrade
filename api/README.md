# Listings connection

The Explore and booking pages read active skills from PostgreSQL through `GET /api/listings`.
The database password stays in the API container and is never sent to React.

## Run locally

From the project folder, add your database password to `secrets/db_password.txt`
if you have not already done that. Use the same password as your existing database.

```sh
docker compose -f compose.prod.yaml --profile production up --build
```

Open http://localhost:3000/explore. Click Book on a skill to open its booking
page with the title, teacher, duration and point cost. The seed has two active
listings. The draft listing is not shown. Refresh to read the database again.
Opening /booking directly asks you to choose a skill from Explore first.

The development command also starts the API:

```sh
docker compose --profile development up --build --watch
```

Open http://localhost:5173/explore in development. The frontend proxy uses the
Docker service name `api`, so use Compose for this setup.

## Check the connection

```sh
curl http://localhost:3000/api/listings

docker compose -f compose.database.yaml exec db psql -U postgres -d skilltrade_db
```

Inside psql, try:

```sql
SELECT listing_id, title, status FROM skilltrade.skill_listings ORDER BY listing_id;
UPDATE skilltrade.skill_listings SET title = 'Photography basics (demo)' WHERE listing_id = 1;
```

Refresh Explore or the booking page for that skill to see the new title.
Restore the sample title afterward:

```sql
UPDATE skilltrade.skill_listings SET title = 'Photography basics' WHERE listing_id = 1;
```

Listing details and login are connected. Availability and saving booking
requests are not connected yet. The page labels the booking action as a preview.
No Azure deployment is included in this change.

## Login authentication

The existing intro/login form now posts to `POST /api/auth/login` with JSON
`{ "email": "sam@example.com", "password": "your-password" }`. Passwords are
verified with Argon2 against `users.password_hash`; email matching is case-insensitive.
Incorrect passwords, unknown users, and restricted/deactivated accounts receive
the same error. The response never includes a password hash or a token.

Successful login sets an opaque random `skilltrade_session` cookie, marked
HttpOnly, SameSite=Strict, scoped to `/api`, and valid for eight hours. PostgreSQL
stores only its SHA-256 hash in the new `skilltrade.login_sessions` table. The API
creates that table additively on startup using `auth/schema.sql`; existing schema,
seed data, reset/refresh tokens, and teammate features are not changed.

- `GET /api/auth/me` returns the verified user or 401. Sessions persist across API restarts.
- `POST /api/auth/logout` revokes the session and expires the cookie.
- Login, logout, and rating PUT require `X-SkillTrade-Request: 1`. No credentialed
  cross-origin access is enabled; do not enable CORS without reviewing CSRF protection.
- Set `AUTH_COOKIE_SECURE=true` on the API for HTTPS deployment. The default allows
  local HTTP development. Use HTTPS before handling real credentials off your machine.
- Login attempts are limited per email and connection address, with a cap on
  simultaneous password checks. This single-process limiter resets on restart;
  multiple API replicas would need a shared limiter. Behind the current proxy,
  the address limit is shared among clients; forwarded IP headers are not trusted.

Signup is unchanged and still does not create accounts. Its eventual backend
should save `await argon2.hash(password)` in `users.password_hash`, never plaintext.
No signup endpoint, reset-email feature, booking persistence, site-wide route guards,
or account navigation redesign is included here.

### Local credentials

The seed provides existing password hashes, but does not document their plaintext
password. Do not assume they match a guessed demo password. No existing user's
password is changed by this implementation or its tests.

If you intentionally want to set a password for an existing local demo account,
start/rebuild the API first so its login table exists, then from the `api` folder run:

```sh
PGPASSWORD_FILE=../secrets/db_password.txt node auth/set-password.js sara@example.com
```

It prompts twice without displaying the password, updates only that account's
password, and revokes its login sessions. It does not create an account or change
its name, role, points, or profile. This tool is optional and has not been run
against the shared database. It is local setup, not the user-facing reset feature.

Rebuild using your existing development or production Compose command to pick up
the API files, Argon2 dependency, and updated frontend. The existing same-origin
`/api` proxy is used; no proxy changes are required.

### Tests

Run `npm test --prefix api` for login HTTP tests using real Argon2 verification
and a fake database. Tests cover incorrect credentials, account restrictions,
cookie protection, session rotation, expiry, logout, throttling, and service errors.
