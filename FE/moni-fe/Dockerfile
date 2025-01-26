FROM node:18 AS builder
WORKDIR /app
ENV NODE_ENV production
COPY package*.json ./
RUN npm ci --only=production
USER node
COPY --chown=node:node . .
RUN npm run build

# Stage 2: Setup the Nginx Server to serve the React Application
FROM nginx:1.25.0-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]