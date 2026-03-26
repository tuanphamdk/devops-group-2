# builder stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
#  RUN npm test / npm run build if needed

# production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
COPY --from=builder /app ./
EXPOSE 8080
CMD ["npm", "start"]
# CMD ["npm", "run", "start"]