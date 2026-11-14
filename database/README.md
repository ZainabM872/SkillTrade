# SkillTrade database schema and seeding - PG 9

## What you need

Use PostgreSQL 18 and Docker Desktop with Docker Compose v2 or newer. Run the commands from the main project folder, where the Compose files are.

- `database/schema.sql`: creates the 22 tables, their relationships, checks, indexes, triggers and four views.
- `database/seed.sql`: adds sample data for the tables.
- `database/verify.sql`: checks the data and a few database rules. It rolls back any changes it makes.
- `compose.database.yaml`: runs just the database. The development and production files also use this setup.
- `database/seng513-schema-pg-9.pdf`: PDF copy of these instructions.

The database name is `skilltrade_db`, the user is `postgres`, and the schema is `skilltrade`. Run `schema.sql` first, then `seed.sql`, on an empty database. Each file runs in a transaction, so if a statement fails, its changes are rolled back.

## 1. Add a database password

Make a `secrets` folder in the main project folder:

```sh
mkdir -p secrets
```

Create `secrets/db_password.txt` in a text editor and put your database password on the first line. Don't leave it blank. This file is ignored by Git and isn't included in the ZIP. This password is for PostgreSQL, not the sample users.

## 2. Start the database

```sh
docker compose -f compose.database.yaml up -d --wait db
docker compose -f compose.database.yaml logs db
```

The first time you start with an empty volume, Docker runs `schema.sql` and then `seed.sql` automatically. They are loaded as `01-schema.sql` and `02-seed.sql` to keep the order right. Check the logs for errors before moving on.

Local connection: host `127.0.0.1`, port `3307`, database `skilltrade_db`, user `postgres`, password from your local file. Inside Docker, use server `db` and port `5432`. pgAdmin can use the local connection settings.

## 3. Check the data

```sh
docker compose -f compose.database.yaml exec -T db psql -U postgres -d skilltrade_db \
  -v ON_ERROR_STOP=1 < database/verify.sql
```

You should see `Schema and seed verification passed`. There should be 22 tables, five users, three listings, three sessions and four point transactions. Reviews, learning_goals, goal_progress, messages, reports, moderation_actions and platform_settings each have two rows. auth_tokens is left empty since we don't need sample login tokens.

Users 1, 2 and 3 receive 30 points each. Session 1 transfers 15 points from learner 2 to teacher 1. Final balances for users 1-5 are 45, 15, 30, 0 and 0, matching the ledger. Goal progress is 25% and 100%.

To run your own queries:

```sh
docker compose -f compose.database.yaml exec db psql -U postgres -d skilltrade_db
```

Example queries:

```sql
SELECT * FROM skilltrade.point_balance_audit ORDER BY user_id;
SELECT * FROM skilltrade.current_goal_progress ORDER BY goal_id;
```

## 4. Run the frontend

For development:

```sh
docker compose --profile development up --build --watch
```

Open http://localhost:5173. For the production build served locally:

```sh
docker compose -f compose.prod.yaml --profile production up --build
```

Open http://localhost:3000. Both commands also start the database and share its data when run from the same project folder. Run one frontend mode at a time. The booking page reads active listing details through the API. Login and saving bookings still need backend work. See api/README.md for the connection and demo steps.

If you want to view the database in a browser, you can use Adminer:

```sh
docker compose --profile tools up -d adminer
```

Open http://localhost:8080. Select PostgreSQL, server `db`, user `postgres`, database `skilltrade_db`, and your local database password.

## 5. Stop or try a fresh database

```sh
docker compose -f compose.database.yaml down
```

This keeps the saved data. Docker only runs the SQL files when the volume is empty, so restarting won't add the sample data again. Changing the scripts also won't update an existing database. This setup uses a new volume called `skilltrade-pg18-data` under the Compose project. It leaves any old volumes alone.

To try a fresh database, stop the current containers first so port 3307 is free. Then use a different project name:

```sh
docker compose -p skilltrade-schema-check -f compose.database.yaml up -d --wait db
docker compose -p skilltrade-schema-check -f compose.database.yaml exec -T db psql \
  -U postgres -d skilltrade_db -v ON_ERROR_STOP=1 < database/verify.sql
docker compose -p skilltrade-schema-check -f compose.database.yaml down
```

If setup fails, check the logs, fix the problem and try again with a new project name. Docker won't rerun the scripts in a volume it has already started setting up. Also, editing the password file won't change the password in an existing database.

## Running without Docker

If you already have PostgreSQL 18, create an empty database and run the files below in order. Change the host, port and user if your local setup uses different ones.

```sh
createdb -h localhost -p 5432 -U postgres skilltrade_schema_check
psql -h localhost -p 5432 -U postgres -d skilltrade_schema_check -v ON_ERROR_STOP=1 \
  -f database/schema.sql
psql -h localhost -p 5432 -U postgres -d skilltrade_schema_check -v ON_ERROR_STOP=1 \
  -f database/seed.sql
psql -h localhost -p 5432 -U postgres -d skilltrade_schema_check -v ON_ERROR_STOP=1 \
  -f database/verify.sql
```

Don't run these again on the Docker database if it already has the tables and sample data.

## Sample data

The sample users are Alex (1), Sam (2), Taylor (3), Morgan (4, moderator) and Jordan (5, admin). Their emails use example.com. The passwords use the original Argon2id hashes, with the missing `$` added at the start. The demo login password still needs to be checked. The SQL doesn't store plaintext passwords.

The sample sessions are one hour and cost 15 points. We still need to decide how to round points for shorter sessions. The triggers check the saved cost and session participants. The backend will need to handle login and permissions.

## Submitting

Commit the SQL files, Compose files, README and PDF to the repo. Once the final version is committed, add the required tag and push:

```sh
git tag -a schema-milestone -m "Database schema and seeding milestone"
git push origin HEAD
git push origin schema-milestone
```

If the tag already exists, check it before changing anything. Upload `seng513-schema-pg-9.zip` to the Database Schema and Seeding Script Dropbox in D2L. The ZIP includes the SQL, instructions and `seng513-schema-pg-9.pdf`.

