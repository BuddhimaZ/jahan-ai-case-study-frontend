## Multi-stage build for Vite + TypeScript app

# 1) Build stage: compile the app
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first (better cache utilization)
COPY package*.json ./
RUN npm install

# Copy the rest of the source and build
COPY . .
RUN npm run build

# 2) Runtime stage: serve static files with Nginx
FROM nginx:1.27-alpine AS runner

# Copy custom nginx conf (with SPA fallback and asset caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

