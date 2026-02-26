Set-Location -Path 'C:\WorkSpace\devops-project'

# Build image using Dockerfile at repo root, but use the frontend folder as the build context
docker build -t devops-project-group3:1.0 -f dockerfile ./frontend

# Run container (maps host 8080 -> container 3000)
docker run -d --name test-app -p 8080:3000 devops-project-group3:1.0

docker images
docker ps -a
docker logs test-app
docker stop test-app
docker rm test-app

# từ C:\WorkSpace\devops-project
docker-compose up --build -d