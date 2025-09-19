#!/bin/bash

# Secure build script for todo app

echo "🔒 Building secure Docker image..."

# Update dependencies first
echo "📦 Updating dependencies..."
cd backend && npm audit fix --force
cd ../client && npm audit fix --force
cd ..

# Build the secure image
echo "🏗️ Building secure Docker image..."
docker build -f Dockerfile.secure -t kriaa693/getting-started-todo-app:secure .

# Scan with Docker Scout (if available)
echo "🔍 Scanning with Docker Scout..."
docker scout cves kriaa693/getting-started-todo-app:secure 2>/dev/null || echo "Docker Scout not available"

# Tag as latest if build succeeds
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Tagging as latest..."
    docker tag kriaa693/getting-started-todo-app:secure kriaa693/getting-started-todo-app:latest
    
    echo "🚀 Ready to push:"
    echo "docker push kriaa693/getting-started-todo-app:secure"
    echo "docker push kriaa693/getting-started-todo-app:latest"
else
    echo "❌ Build failed!"
    exit 1
fi
