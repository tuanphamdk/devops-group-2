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

# YOUR CODE HERE:

# STAGE 1: Builder
# Define base image for builder stage
FROM node:18-alpine AS builder

# Define work directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all files
COPY . .

# Build the React app
RUN npm run build

# STAGE 2: Production
# Define base image for production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Install 'serve' package globally
RUN npm install -g serve

# Copy only the build folder from builder stage
COPY --from=builder /usr/src/app/build ./build

# Expose port
EXPOSE 3000

# Run the app
CMD ["serve", "-s", "build", "-l", "3000"]
