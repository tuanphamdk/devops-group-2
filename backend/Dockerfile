# ===========================================
# STUDENT TODO: Create a Multi-Stage Dockerfile
# ===========================================
#
# Requirements:
# 1. Stage 1 (builder):
#    - Use node:18-alpine as base
#    - Set working directory
#    - Copy package files and install ALL dependencies
#    - Copy source code
#
# 2. Stage 2 (production):
#    - Use node:18-alpine as base
#    - Set working directory
#    - Copy only package files from builder
#    - Install ONLY production dependencies (hint: --only=production)
#    - Copy application code from builder
#    - Expose the correct port
#    - Set the start command
#
# Hints:
# - Research: "Docker multi-stage build Node.js"
# - Use COPY --from=builder to copy between stages
# - Final image should be as small as possible
# ===========================================

# YOUR CODE HERE:

# STAGE 1: Builder
# Define base image for builder stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# STAGE 2: Production
# Define base image for production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy only package files from builder and install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy application code from builder
COPY --from=builder /app ./

# Expose the correct port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]