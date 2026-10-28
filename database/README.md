# Database: points, learning and moderation

My part covers these eight tables:

- point_transactions
- reviews
- learning_goals
- goal_progress
- messages
- reports
- moderation_actions
- platform_settings

`schema.sql` creates the tables and their rules. `seed.sql` adds sample data. Check `shared-tables.md` before combining this with the accounts and scheduling work.

## Running it

Use PostgreSQL 17. The accounts and scheduling tables need to exist first because these tables reference users, listings and sessions.

Run the files in this order:

1. Accounts and scheduling schema
2. This schema.sql
3. Accounts and scheduling seed
4. This seed.sql

Put these SQL files in the repository's `database` folder. With the team's Docker database running, run these from the repository folder, at the appropriate steps above:

```sh
docker compose -p skilltrade --profile database exec -T db psql -U skilltrade -d skilltrade -v ON_ERROR_STOP=1 < database/schema.sql
```

```sh
docker compose -p skilltrade --profile database exec -T db psql -U skilltrade -d skilltrade -v ON_ERROR_STOP=1 < database/seed.sql
```

Change `skilltrade` after `-p` if the Docker project has a different name. This ZIP doesn't include the Docker setup.

Use a fresh database for the combined setup. Run each script once. They don't clear old data, so running them again will fail if the tables or sample IDs already exist. Both scripts use transactions, so a failed run rolls back the data changes; sequence numbers can still advance.

## Checking the data

Run these in psql:

```sql
SELECT user_id, point_balance, ledger_balance
FROM skilltrade.point_balance_audit ORDER BY user_id;
SELECT * FROM skilltrade.reviews;
SELECT * FROM skilltrade.current_goal_progress;
SELECT * FROM skilltrade.reports;
```

The two balance columns should match. There should be 4 point transactions and 2 rows in each of the other seven tables.

## Points

The rate is 15 points per hour. The sample gives three users 30 points each, then transfers 15 points for a one-hour session. Their final balances are 45, 15 and 30.

The session seed needs to use the same duration and cost. We still need to decide how to round shorter sessions, since the amounts are whole numbers.

## Still to do

Test this with the finished accounts and scheduling scripts, then put together the final README, PDF and ZIP. The earlier full draft passed its tests, but this split hasn't been tested with the other half yet. The website isn't connected to the database yet.
