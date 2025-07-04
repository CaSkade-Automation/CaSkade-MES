# Build stage for shared module
FROM node:16.15.0-alpine AS shared-build

WORKDIR /app/shared
COPY shared/package*.json ./
RUN npm ci
COPY shared/ ./
COPY tsconfig.base.json /app/
RUN npm run build

# Build stage for frontend
FROM node:16.15.0-alpine AS frontend-build

WORKDIR /app

# Copy shared module build
COPY --from=shared-build /app/shared ./shared

# Copy frontend files
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

# Copy source files
COPY frontend/ ./
COPY tsconfig.base.json /app/

# Build frontend
RUN npm run build

# Production stage with nginx
FROM nginx:1.25-alpine AS production

# Copy custom nginx config
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy built frontend from build stage
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 && \
    chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

USER nginx-user

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]