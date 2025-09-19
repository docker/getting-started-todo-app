@echo off
echo 🔒 Building secure Docker image...

echo 📦 Updating dependencies...
cd backend
call npm audit fix --force
cd ..\client  
call npm audit fix --force
cd ..

echo 🏗️ Building secure Docker image...
docker build -f Dockerfile.secure -t kriaa693/getting-started-todo-app:secure .

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful! Tagging as latest...
    docker tag kriaa693/getting-started-todo-app:secure kriaa693/getting-started-todo-app:latest
    
    echo 🚀 Ready to push:
    echo docker push kriaa693/getting-started-todo-app:secure
    echo docker push kriaa693/getting-started-todo-app:latest
) else (
    echo ❌ Build failed!
    exit /b 1
)
