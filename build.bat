@echo off
setlocal enabledelayedexpansion

echo �️ Secure Todo App - Production Build Script
echo.
echo This script builds a production-ready Docker image with:
echo ✅ Security hardening (non-root user, minimal attack surface)
echo ✅ Supply chain attestations (SBOM + provenance)
echo ✅ Multi-platform support (amd64 + arm64)
echo ✅ Docker Scout compliance
echo.

REM Enable BuildKit
set DOCKER_BUILDKIT=1

REM Check if buildx is available
docker buildx version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker BuildX is required. Please install Docker Desktop or enable BuildKit
    echo.
    echo Installation guide: https://docs.docker.com/buildx/working-with-buildx/
    exit /b 1
)

echo 📦 Updating dependencies for security...
cd backend && npm audit fix --force --silent
cd ../client && npm audit fix --force --silent
cd ..

REM Create a new builder instance if needed
docker buildx inspect attestation-builder >nul 2>&1
if errorlevel 1 (
    echo � Creating new builder instance...
    docker buildx create --name attestation-builder --use
    docker buildx bootstrap
) else (
    docker buildx use attestation-builder
)

echo 🏗️ Building secure image with attestations...
echo Platform targets: linux/amd64, linux/arm64
echo.

REM Build with attestations - modify image name as needed
docker buildx build ^
    --builder attestation-builder ^
    --platform linux/amd64,linux/arm64 ^
    --provenance=true ^
    --sbom=true ^
    --push ^
    -f Dockerfile ^
    -t kriaa693/getting-started-todo-app:latest ^
    -t kriaa693/getting-started-todo-app:secure ^
    -t kriaa693/getting-started-todo-app:v1.0.0 ^
    .

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful with attestations!
    echo.
    echo 🔍 Verification commands:
    echo   docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest
    echo   docker scout cves kriaa693/getting-started-todo-app:latest
    echo   docker scout sbom kriaa693/getting-started-todo-app:latest
    echo.
    echo � Deploy commands:
    echo   docker-compose up -d
    echo   docker run -p 3000:3000 kriaa693/getting-started-todo-app:latest
    echo.
    echo 📋 Image tags created:
    echo   • kriaa693/getting-started-todo-app:latest
    echo   • kriaa693/getting-started-todo-app:secure  
    echo   • kriaa693/getting-started-todo-app:v1.0.0
) else (
    echo.
    echo ❌ Build failed! Check the error messages above.
    echo.
    echo 🔧 Troubleshooting:
    echo   • Ensure Docker Desktop is running
    echo   • Check network connectivity for pushing to registry
    echo   • Verify Docker Hub authentication: docker login
    exit /b 1
)
