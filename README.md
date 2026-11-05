# SkillTrade

A skill-sharing app. The React intro runs in Docker; login is still a preview.

## Database setup

Before running Docker, add your database password to `secrets/db_password.txt`. PostgreSQL 18 runs `database/schema.sql` and then `database/seed.sql` automatically when the volume is empty. See the [database README](database/README.md) for setup and submission steps.

Database only: `docker compose -f compose.database.yaml up -d --wait db`.

## Run it

Open Docker Desktop, then run this from the repository folder:

```sh
docker compose -f compose.prod.yaml --profile production up --build
```

Open http://localhost:3000. Stop with Ctrl+C, then run:

```sh
docker compose -f compose.prod.yaml --profile production down
```

For development with file watching:

```sh
docker compose --profile development up --build --watch
```

Open http://localhost:5173. Run one mode at a time. More details: [Docker setup](docs/docker.md).

## Where things are

| Folder or file | What's in it |
| --- | --- |
| `webui/src/pages/` | Pages, starting with `intro.js` |
| `webui/src/styles/` | CSS and existing SVG icons |
| `webui/src/App.js` | Page routes |
| `webui/public/` | HTML entry point and public assets |
| `docker/` | Development and production Dockerfiles |
| `compose.yaml` | Docker services and ports |
| `docs/design/` | Original HTML intro reference |
| `docs/team/` | Meeting notes and page assignments |
| `docs/intro.md` | Intro behavior and implementation notes |
| `.gitlab-ci.yml` | Current placeholder pipeline |

There is no active Python backend. The previous Flask page was replaced by React.

## Test without Docker

With Node.js and npm installed:

```sh
cd webui
npm ci
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

The GitLab pipeline currently prints sample build/test/deploy messages. A green pipeline does not mean these app checks ran or that the site was deployed.
