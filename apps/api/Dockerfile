# VeroField API - Production Dockerfile
# Multi-stage build for optimized image size

# Stage 1: Build
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ postgresql-client

WORKDIR /app

# Copy root package files for workspace setup
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
COPY libs/common/package.json ./libs/common/

# Copy Prisma schema
COPY libs/common/prisma ./libs/common/prisma

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY apps/api ./apps/api
COPY libs/common ./libs/common

# Generate Prisma client
WORKDIR /app/apps/api
RUN npx prisma generate --schema=../../libs/common/prisma/schema.prisma

# Build the application
RUN npm run build

# Remove devDependencies
WORKDIR /app
RUN npm prune --production

# Stage 2: Production
FROM node:18-alpine

# Install runtime dependencies
RUN apk add --no-cache \
    postgresql-client \
    curl \
    ca-certificates \
    dumb-init

# Create app user for security (don't run as root)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application from builder
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/libs/common/prisma ./libs/common/prisma
COPY --from=builder --chown=nodejs:nodejs /app/libs/common/node_modules ./libs/common/node_modules

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/main.js"]

