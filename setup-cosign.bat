@echo off
echo 🔑 Setting up Cosign for image signing...

REM Check if cosign is installed
cosign version >nul 2>&1
if errorlevel 1 (
    echo 📥 Installing Cosign...
    
    REM Download cosign for Windows
    echo Downloading cosign...
    curl -L -o cosign.exe https://github.com/sigstore/cosign/releases/latest/download/cosign-windows-amd64.exe
    
    REM Move to PATH (adjust as needed)
    move cosign.exe C:\Windows\System32\
    echo ✅ Cosign installed
) else (
    echo ✅ Cosign already installed
)

echo 🔐 Generating key pair for signing...

REM Generate cosign key pair (will prompt for password)
if not exist cosign.key (
    cosign generate-key-pair
    echo ✅ Key pair generated: cosign.key, cosign.pub
) else (
    echo ✅ Key pair already exists
)

echo 🚀 Usage:
echo 1. Build image: docker build -t kriaa693/getting-started-todo-app:latest .
echo 2. Push image: docker push kriaa693/getting-started-todo-app:latest  
echo 3. Sign image: cosign sign --key cosign.key kriaa693/getting-started-todo-app:latest
echo 4. Verify: cosign verify --key cosign.pub kriaa693/getting-started-todo-app:latest

echo.
echo 💡 Keep cosign.key secure! Share cosign.pub for verification.
