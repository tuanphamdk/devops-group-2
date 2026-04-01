

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
