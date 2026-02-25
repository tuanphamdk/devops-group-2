# ===========================================
# Multi-Stage Dockerfile for Backend
# ===========================================

# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

# Copy application code from builder
COPY --from=builder /app/server.js ./
COPY --from=builder /app/tests ./tests
