@echo off
echo 🔒 Building secure Docker image...

echo 📦 Updating dependencies...
cd backend
call npm audit fix --force
cd ..\client  
call npm audit fix --force
cd ..

echo 🏗️ Building secure Docker image...
docker build -f Dockerfile.secure --target final -t kriaa693/getting-started-todo-app:secure .

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful! Tagging as latest...
    docker tag kriaa693/getting-started-todo-app:secure kriaa693/getting-started-todo-app:latest
    
    echo 🚀 Ready to push:
    echo docker push kriaa693/getting-started-todo-app:secure
    echo docker push kriaa693/getting-started-todo-app:latest
    
    echo 🔍 Security improvements applied:
    echo ✅ Non-root user (nextjs:nodejs)
    echo ✅ Alpine Linux base image
    echo ✅ Removed sqlite3 dependency (production uses MySQL)
    echo ✅ Security updates applied
    echo ✅ Health check endpoint added
    echo ✅ dumb-init for proper signal handling
) else (
    echo ❌ Build failed!
    exit /b 1
)
