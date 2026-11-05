# Docker setup

Install and open Docker Desktop. Run commands from the repository root.
Create `secrets/db_password.txt` with a non-empty password first.

See [database instructions](../database/README.md) for how to set up the database,
check the data and connect to it.

## Database only

```sh
docker compose -f compose.database.yaml up -d --wait db
```

## Production

```sh
docker compose -f compose.prod.yaml --profile production up --build
```

Open http://localhost:3000. This builds React and serves it with Nginx, alongside PostgreSQL.

## Development

```sh
docker compose --profile development up --build --watch
```

Open http://localhost:5173. Source changes sync; package changes rebuild.
Run one frontend mode at a time. Both modes share the PostgreSQL service and volume.

## Stop

Stop a foreground run with Ctrl+C, then use `down` with the same Compose file.
Database-only stop: `docker compose -f compose.database.yaml down`.
Production stop: `docker compose -f compose.prod.yaml --profile production down`.
Development stop: `docker compose --profile development down`.
These preserve the database volume. Do not add `-v` unless you intend to delete that project's database data.

## Optional SQL interface

```sh
docker compose --profile tools up -d adminer
```

Open http://localhost:8080. Choose PostgreSQL, server `db`, user `postgres`,
database `skilltrade_db`, and the password in your local secrets file.
phpMyAdmin was removed because it supports MySQL, not PostgreSQL.

PostgreSQL uses container port 5432 and local port 3307. PostgreSQL 18 keeps its
data below `/var/lib/postgresql`, mounted to a new named volume.
Docker runs `01-schema.sql` and `02-seed.sql` automatically when the volume is empty.
The root `pg_hba.conf` is a legacy reference and is not mounted by this setup;
the official image configures authentication using the password secret.
The current frontend remains a preview without a connected backend.
