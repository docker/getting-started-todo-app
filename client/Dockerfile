# Use Node.js Alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Expose port 5173 (Vite default dev server port)
EXPOSE 5173

# Create non-root user for security and change ownership
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactjs -u 1001 && \
    chown -R reactjs:nodejs /app

USER reactjs

# Start the development server
CMD ["npm", "run", "dev"]
