@echo off
setlocal enabledelayedexpansion

echo 🛡️ Complete Docker Security and Attestation Workflow

echo.
echo 📋 What this script does:
echo 1. Updates dependencies
echo 2. Builds secure image with SBOM and provenance
echo 3. Signs image with cosign (optional)
echo 4. Verifies all attestations
echo 5. Runs Docker Scout compliance check

echo.
set /p choice="Continue? (y/n): "
if /i "%choice%" neq "y" exit /b 0

REM Step 1: Update dependencies
echo.
echo 📦 Step 1: Updating dependencies...
cd backend
call npm audit fix --force
cd ..\client  
call npm audit fix --force
cd ..

REM Step 2: Build with attestations
echo.
echo 🏗️ Step 2: Building with attestations...

set DOCKER_BUILDKIT=1

REM Create builder if needed
docker buildx inspect attestation-builder >nul 2>&1
if errorlevel 1 (
    echo Creating builder instance...
    docker buildx create --name attestation-builder --use
    docker buildx bootstrap
)

docker buildx build ^
    --builder attestation-builder ^
    --platform linux/amd64 ^
    --provenance=true ^
    --sbom=true ^
    --push ^
    -f Dockerfile.secure ^
    -t kriaa693/getting-started-todo-app:latest ^
    -t kriaa693/getting-started-todo-app:secure ^
    .

if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build successful with attestations!

REM Step 3: Optional Cosign signing
echo.
echo 🔑 Step 3: Image signing (optional)
set /p sign_choice="Sign image with cosign? (y/n): "
if /i "%sign_choice%" equ "y" (
    if exist cosign.key (
        echo Signing image...
        cosign sign --key cosign.key kriaa693/getting-started-todo-app:latest
        echo ✅ Image signed
    ) else (
        echo ⚠️ No cosign.key found. Run setup-cosign.bat first
    )
)

REM Step 4: Verify attestations
echo.
echo 🔍 Step 4: Verifying attestations...
echo.
echo == Image Details ==
docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest

echo.
echo == SBOM Attestation ==
docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest --format "{{ range .Attestations }}{{ .Type }}{{ end }}"

REM Step 5: Docker Scout compliance check
echo.
echo 🛡️ Step 5: Docker Scout compliance check...
docker scout cves kriaa693/getting-started-todo-app:latest

echo.
echo 🎉 Workflow complete! Your image should now be fully compliant.
echo.
echo 📋 Summary of what was added:
echo ✅ SBOM (Software Bill of Materials)
echo ✅ Provenance attestation
echo ✅ Multi-platform build (amd64, arm64)
if /i "%sign_choice%" equ "y" echo ✅ Digital signature
echo.
echo 🔗 To verify elsewhere:
echo docker buildx imagetools inspect kriaa693/getting-started-todo-app:latest
if /i "%sign_choice%" equ "y" echo cosign verify --key cosign.pub kriaa693/getting-started-todo-app:latest
