# Listings connection

The booking page reads active skills from PostgreSQL through `GET /api/listings`.
The database password stays in the API container and is never sent to React.

## Run locally

From the project folder, add your database password to `secrets/db_password.txt`
if you have not already done that. Use the same password as your existing database.

```sh
docker compose -f compose.prod.yaml --profile production up --build
```

Open http://localhost:3000/booking. Choose a skill to see its title, teacher,
duration and point cost. The seed has two active listings. The draft listing is
not shown. Refresh the page to read the database again.

The development command also starts the API:

```sh
docker compose --profile development up --build --watch
```

Open http://localhost:5173/booking in development. The frontend proxy uses the
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

Refresh the booking page. The new title should appear in the selector and summary.
Restore the sample title afterward:

```sql
UPDATE skilltrade.skill_listings SET title = 'Photography basics' WHERE listing_id = 1;
```

This only connects the listing details. Login, availability, and saving booking
requests are not connected yet. The page labels the booking action as a preview.
No Azure deployment is included in this change.
