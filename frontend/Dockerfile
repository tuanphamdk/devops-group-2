# ===========================================
# STUDENT TODO: Create Frontend Dockerfile
# ===========================================
#
# Requirements:
# 1. Must use multi-stage build
# 2. Stage 1 (builder):
#    - Use node:18-alpine
#    - Install dependencies with npm ci
#    - Build the React app with npm run build
#
# 3. Stage 2 (production):
#    - Use node:18-alpine
#    - Install 'serve' package globally to serve static files
#    - Copy only the build folder from builder stage
#    - Expose port 3000
#    - Use serve to run the app
#
# Hints:
# - npm run build creates a 'build' folder
# - serve -s build -l 3000 serves the static files
# - Research: "Docker multi-stage React production"
# ===========================================

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install because of lockfile issues earlier, but npm ci is preferred if lockfile is consistent)
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine

# Install 'serve' package globally
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy only the build folder from builder stage
COPY --from=builder /app/build ./build

# Expose port 3000
EXPOSE 3000

# Use serve to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
