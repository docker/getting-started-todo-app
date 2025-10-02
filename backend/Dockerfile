###################################################
# Backend Dockerfile - Production-ready
###################################################
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Install dumb-init and create non-root user
RUN apk add --no-cache dumb-init \
    && addgroup -S nodejs -g 1001 \
    && adduser -S nextjs -u 1001 -G nodejs

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy source code
COPY src ./src

# Create logs directory
RUN mkdir -p /usr/src/app/logs \
    && chown -R nextjs:nodejs /usr/src/app

# Switch to non-root user
USER nextjs

# Expose port and start app
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"
