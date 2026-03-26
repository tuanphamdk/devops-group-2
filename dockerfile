# --- Stage 1: The "builder" stage ---
# Use a full Node.js image to build our app
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application source code
COPY . .

# (If your project has a build step, e.g., TypeScript, add it here)
# RUN npm run build

# --- Stage 2: The "production" stage ---
# Start from a fresh, lightweight base image
FROM node:18-alpine
WORKDIR /app

# Copy the package.json and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built app code from the "builder" stage
COPY --from=builder /app/src ./src
# (If you had a build step, you would copy the 'dist' folder instead)
# COPY --from=builder /app/dist ./dist
# Expose the port the app listens on (check your app's code, e.g., server.js)
EXPOSE 3000

# The command to run the application (check your package.json 'start' script)
CMD [ "npm", "start" ]

# Build the image from the Dockerfile in the current directory (.)
# -t tags it as 'my-app:1.0' (replace 'my-app' with your project name)
# $ docker build -t devops-project-group3:1.0 .

# Run the container. -p 8080:3000 maps your PC's port 8080 to the container's 3000
# $ docker run -d --name test-app -p 8080:3000 devops-project-group3:1.0

# Check its logs. You might see "Error connecting to database". This is fine.
# $ docker logs test-app

# Stop and remove the test container
# $ docker stop test-app
# $ docker rm test-app
