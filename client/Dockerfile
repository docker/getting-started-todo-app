###################################################
# Frontend Dockerfile - Vite React Dev
###################################################
FROM node:22-alpine
WORKDIR /app

# Install dependencies as root
COPY package.json package-lock.json ./
RUN npm ci

# Copy app source
COPY . .

# Create non-root user and set ownership
RUN addgroup -S nodejs -g 1001 \
    && adduser -S reactjs -u 1001 -G nodejs \
    && chown -R reactjs:nodejs /app

# Switch to non-root user
USER reactjs

# Expose Vite dev server port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
