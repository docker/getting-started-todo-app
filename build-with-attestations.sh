#!/bin/bash

# Build script with supply chain attestations
# This generates SBOM and provenance attestations automatically

echo "🔒 Building secure Docker image with supply chain attestations..."

# Enable BuildKit
export DOCKER_BUILDKIT=1

# Check if buildx is available
if ! docker buildx version > /dev/null 2>&1; then
    echo "❌ Docker BuildX is required. Please install Docker Desktop or enable BuildKit"
    exit 1
fi

# Create a new builder instance if needed
if ! docker buildx inspect attestation-builder > /dev/null 2>&1; then
    echo "📦 Creating new builder instance..."
    docker buildx create --name attestation-builder --use
    docker buildx bootstrap
fi

echo "🏗️ Building with SBOM and provenance attestations..."

# Build with attestations
docker buildx build \
    --builder attestation-builder \
    --platform linux/amd64,linux/arm64 \
    --provenance=true \
    --sbom=true \
    --push \
    -f Dockerfile.secure \
    --target final \
    -t kriaa693/getting-started-todo-app:latest \
    -t kriaa693/getting-started-todo-app:secure \
    .

if [ $? -eq 0 ]; then
    echo "✅ Build successful with attestations!"
    echo "🔍 Verify attestations:"
    echo "docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest --format '{{json .}}'"
    echo ""
    echo "🔍 Check Scout compliance:"
    echo "docker scout cves kriaa693/getting-started-todo-app:latest"
else
    echo "❌ Build failed!"
    exit 1
fi
