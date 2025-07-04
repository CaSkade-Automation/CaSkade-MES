# Build stage for shared module
FROM node:16.15.0-alpine AS shared-build

WORKDIR /app/shared
COPY shared/package*.json ./
RUN npm ci
COPY shared/ ./
COPY tsconfig.base.json /app/
RUN npm run build

# Build stage for backend
FROM node:16.15.0-alpine AS backend-build

WORKDIR /app

# Copy shared module build
COPY --from=shared-build /app/shared ./shared

# Copy backend files
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci

# Copy source files
COPY backend/ ./
COPY tsconfig.base.json /app/

# Build backend
RUN npm run build

# Production stage
FROM node:16.15.0-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy shared module
COPY --from=shared-build /app/shared ./shared

# Copy backend production dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production && npm cache clean --force
RUN npm install tsconfig-paths

# Copy built backend
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/tsconfig.base.json /app/
COPY backend/tsconfig.json ./

# Create uploads directory
RUN mkdir -p /app/backend/uploaded-files

# Use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 9090

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]