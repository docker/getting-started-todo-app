@echo off
setlocal enabledelayedexpansion

echo 🔒 Building secure Docker image with supply chain attestations...

REM Enable BuildKit
set DOCKER_BUILDKIT=1

REM Check if buildx is available
docker buildx version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker BuildX is required. Please install Docker Desktop or enable BuildKit
    exit /b 1
)

REM Create a new builder instance if needed
docker buildx inspect attestation-builder >nul 2>&1
if errorlevel 1 (
    echo 📦 Creating new builder instance...
    docker buildx create --name attestation-builder --use
    docker buildx bootstrap
)

echo 🏗️ Building with SBOM and provenance attestations...

REM Build with attestations
docker buildx build ^
    --builder attestation-builder ^
    --platform linux/amd64,linux/arm64 ^
    --provenance=true ^
    --sbom=true ^
    --push ^
    -f Dockerfile.secure ^
    -t kriaa693/getting-started-todo-app:latest ^
    -t kriaa693/getting-started-todo-app:secure ^
    .

if %errorlevel% equ 0 (
    echo ✅ Build successful with attestations!
    echo 🔍 Verify attestations:
    echo docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest --format "{{json .}}"
    echo.
    echo 🔍 Check Scout compliance:
    echo docker scout cves kriaa693/getting-started-todo-app:latest
) else (
    echo ❌ Build failed!
    exit /b 1
)
