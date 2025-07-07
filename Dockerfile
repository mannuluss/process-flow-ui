# Stage 1: Build the application
FROM node:20-alpine as build
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production

# Copy the build output from the build stage
# The base path is /process-flow-ui/, so we need to put the files in a subdirectory
COPY --from=build /app/dist /usr/share/nginx/html/process-flow-ui

# Copy the nginx configuration
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
