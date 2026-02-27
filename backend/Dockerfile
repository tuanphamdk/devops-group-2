FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

COPY --from=builder /app ./

EXPOSE 8080

CMD ["node", "server.js"]
