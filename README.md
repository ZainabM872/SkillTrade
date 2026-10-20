Docker (setup and run guide)

Setup:
First create a virtual environment in root directory
python -m venv .venv
Activate virtual environment
.venv\Scripts\Activate.ps1
Create the following 3 files in root and a new directory respectively

- Dockerfile.dev
- Dockerfile.prod
- requirements.txt
- docker-compose
  In the docker-compose dir, create the following
  .dockerignore
  .env
  compose.yaml
  infra.yaml (for multiple compose files when applications grow)

In "webui" dir -> npm install, npm install yaml@^2.9.1 --save-dev,

Then build the prod container in root dir: docker build -t my-react-app -f Dockerfile.prod .
Then build the dev container: docker build -t my-react-app-dev -f Dockerfile.dev .

You can run: [docker run -p 5173:5173 my-react-app-dev] or [docker run -p 3000:80 my-react-app-prod] to test both work correctly

Following instructions for running:
