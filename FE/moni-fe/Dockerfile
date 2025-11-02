FROM node:18 AS builder
WORKDIR /app
# Copy package files and install all dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci
COPY . .
# Build the application using npx to ensure tools are available
RUN npx tsc -b && npx vite build

# Stage 2: Setup the Nginx Server to serve the Vue.js Application
FROM nginx:1.25.0-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]