# FROM node:18 AS builder
FROM --platform=linux/arm64 node:18 AS builder
WORKDIR /app
# ENV NODE_ENV=production
ENV NODE_ENV=development
# USER node
COPY package*.json ./
# RUN npm i --no-optional --no-audit --progress=false --loglevel=error
# RUN npm ci --only=production
RUN npm ci
# COPY --chown=node:node . .
COPY . .
RUN npm run build
# USER node

# Stage 2: Setup the Nginx Server to serve the React Application
FROM nginx:1.25.0-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]