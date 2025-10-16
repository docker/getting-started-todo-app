###################################################
# Frontend Dockerfile - Development with Production Build
###################################################

FROM node:22-alpine AS base

# Install dependencies
RUN apk add --no-cache \
    ca-certificates \
    curl \
    git \
    wget

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S -u 1001 -G nodejs reactjs \
    && chown -R reactjs:nodejs /app

# Switch to non-root user
USER reactjs

# Expose Vite dev server port
EXPOSE 5173

# Set environment
ENV NODE_ENV=development

# Health check for dev server
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5173 || exit 1

# Labels
LABEL maintainer="your-email@example.com" \
    app.name="todo-frontend" \
    app.version="2.0.0" \
    app.description="Todo App React Frontend"

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
