# Root Dockerfile - for docker-compose orchestration
FROM docker:latest

RUN apk add --no-cache docker-compose

WORKDIR /app

CMD ["docker-compose", "up"]
