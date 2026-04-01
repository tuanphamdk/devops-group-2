# Multi-stage Dockerfile for Node.js backend
# Stage 1: builder - install all dependencies
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --production --silent

COPY . .

# Stage 2: production - minimal runtime image
FROM node:18-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy node_modules and app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

USER appuser
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]
