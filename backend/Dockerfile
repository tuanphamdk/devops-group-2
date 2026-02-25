FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install --only=production

COPY --from=builder /app ./

EXPOSE 8080

CMD ["node", "server.js"]
