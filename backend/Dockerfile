###################################################
# Backend Dockerfile - Multi-stage Production Build
###################################################

# Build stage
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl

WORKDIR /build

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Run tests and build (if you have build scripts)
# RUN npm run test
# RUN npm run build

###################################################
# Production stage
###################################################
FROM node:22-alpine AS production

# Install runtime dependencies and security tools
RUN apk add --no-cache \
    dumb-init \
    tini \
    wget \
    curl \
    ca-certificates \
    && apk upgrade --no-cache

# Create non-root user with specific UID/GID
RUN addgroup -g 1001 -S nodejs \
    && adduser -S -u 1001 -G nodejs nodejs

WORKDIR /usr/local/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts \
    && npm cache clean --force

# Copy application code from builder
COPY --from=builder --chown=nodejs:nodejs /build/src ./src

# Create necessary directories with proper permissions
RUN mkdir -p /usr/local/app/logs /tmp/app \
    && chown -R nodejs:nodejs /usr/local/app /tmp/app \
    && chmod -R 755 /usr/local/app \
    && chmod -R 777 /tmp/app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Set Node.js production optimizations
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=400 --enable-source-maps" \
    NPM_CONFIG_LOGLEVEL=warn

# Use tini as PID 1 for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start application
CMD ["node", "src/index.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Labels for metadata
LABEL maintainer="your-email@example.com" \
    app.name="todo-backend" \
    app.version="2.0.0" \
    app.description="Todo App Backend API"
