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
# --- STAGE 1: Builder ---
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy the package management files
COPY package*.json ./

# Install dependencies (use npm install instead of ci due to version issues)
RUN npm install --legacy-peer-deps

# Copy all the source code into the container
COPY . .

# Build the React application into static files
RUN npm run build


# --- STAGE 2: Production ---
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install the 'serve' tool globally to host static files
RUN npm install -g serve

# Copy ONLY the 'build' directory from the Builder stage (Stage 1)
COPY --from=builder /app/build ./build

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "build", "-l", "3000"]
