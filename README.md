# Test Application

This is a Test Application.

## Prerequisites

Before you get started, you'll need to have the following tools installed:
- Docker ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose ([Install Docker Compose](https://docs.docker.com/compose/install/))

Make sure Docker is running on your machine before you proceed.

## Getting Started

Follow these steps to get your application running locally:

### 1. Clone the repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/hello-world-was-taken/shamod-test
cd shamod-test
```

### 2. Start the containers
From the root of your project directory (where the docker-compose.yml file is located), run:

```bash
docker-compose up --build
```

### 3. Access the application
After the containers have started, you can access the frontend and backend by:

- Frontend: Open your browser and go to http://localhost:3000.
- Backend: Accessible at http://localhost:8000.

### 3. Developing inside the container
If you want to develop using a consistent, containerized environment, you can use the included .devcontainer configuration with Visual Studio Code:

- Ensure you have Visual Studio Code and the Remote - Containers extension installed.
- Open the root of the project in VS Code, and when prompted, click on "Reopen in Container". This will start a development environment inside a Docker container, which mirrors the settings you would have in production.

### 4. Stopping the Application
To stop all services, you can use Docker Compose from the root directory of the project:

```bash
docker-compose down
```

This command stops and removes all running containers. Use the -v flag if you also want to remove all volumes associated with the containers:

```bash
docker-compose down -v
```