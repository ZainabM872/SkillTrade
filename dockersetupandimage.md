## Docker (setup and run guide)

#### Pulling image to run docker container:

- If you would like to see the whole process of setting up docker and try it yourself, you may read the "Setup" section below.
- Otherwise, you only need the information in this section to run the docker image.

Anyone can directly pull the image from their computer using:

1. docker login
2. docker run --rm -p 30000:80 janezhang1/my-react-app:latest
3. Go to: http://localhost:30000

##### Setup:

###### General file and directory

1. First create a virtual environment in root directory: python -m venv .venv
2. Activate virtual environment: .venv\Scripts\Activate.ps1
3. Create the following 3 files in root

- Dockerfile.dev
- Dockerfile.prod
- requirements.txt
- docker-compose

4. Create a new directory in root folder: docker-compose
5. In the docker-compose dir, create the following

- .dockerignore
- .env
- compose.yaml
- infra.yaml (for multiple compose files when applications grow)

6. Before running the container, in "webui" directory, in the terminal: npm install and npm install yaml@^2.9.1 --save-dev
7. Then go back to root directory and build the prod container: docker build -t my-react-app -f Dockerfile.prod .
8. Same thing, build the dev container: docker build -t my-react-app-dev -f Dockerfile.dev .
9. You can run: [docker run -p 5173:5173 my-react-app-dev] or [docker run -p 3000:80 my-react-app-prod] to test both work correctly
10. To create pullable image so all other devices can run app

- docker login
- Tag image: Type [docker tag my-react-app {your-dockerhub-username}/my-react-app]
- Push image: docker push {your-dockerhub-username}/my-react-app
- Pull image: docker pull {your-dockerhub-username}/my-react-app, docker run -p 30000:80 my-react-app, {your-dockerhub-username}/my-react-app
