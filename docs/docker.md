# Docker setup

Install and open Docker Desktop. Run the commands below from the repository root, where `compose.yaml` is.

## Production

```sh
docker compose --profile production up --build
```

Open http://localhost:3000. This builds React and serves the result with Nginx.

Stop with Ctrl+C, then:

```sh
docker compose --profile production down
```

## Development

```sh
docker compose --profile development up --build --watch
```

Open http://localhost:5173. Changes under `webui/src` and `webui/public` sync into the container. Changes to the app package files trigger a rebuild.

Stop with Ctrl+C, then:

```sh
docker compose --profile development down
```

## Build images directly

```sh
docker build -f docker/Dockerfile.prod -t skilltrade-prod .
docker run --rm -p 3000:80 skilltrade-prod
```

For development:

```sh
docker build -f docker/Dockerfile.dev -t skilltrade-dev .
docker run --rm -p 5173:5173 skilltrade-dev
```

These commands build and run locally. They don't publish an image. Python, Flask and Redis are not required for the current app. Login is still a preview.
