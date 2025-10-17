# syntax=docker/dockerfile:1

# Build stage: compile the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies based on the lockfile
COPY package*.json ./
RUN npm ci

# Copy sources and build for production
COPY . .
RUN npm run build -- --configuration production

# Runtime stage: serve the compiled app with Nginx
FROM nginx:1.27-alpine AS runtime

# Remove default Nginx site config and use our SPA-friendly one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the compiled Angular app from the build stage
COPY --from=build /app/dist/atomchat-fe /usr/share/nginx/html

EXPOSE 80

# Keep Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
