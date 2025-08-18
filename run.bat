@echo off
REM Check if Node.js is installed
echo Check Node.js
call node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
echo Check npm
call npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo npm not found. Please check your Node.js installation.
    pause
    exit /b 1
)

REM Check if node_modules exists
echo Install dependencies
if not exist node_modules (
    echo ^(installing...^)
    call npm install
    if %errorlevel% neq 0 (
        echo npm install failed!
        pause
        exit /b 1
    )
) else (
    echo ^(skipping install, node_modules already exists^)
)

REM ===== 主菜单 =====
:menu
title AI-Agent-Launcher
cls
echo AI-Agent-Launcher
echo ==============================================
echo  1  调试运行Web        (npm run dev)
echo  2  构建迁移Android    (npm run build:android)
echo  3  预览构建           (npm run serve)
echo  0  退出
echo ==============================================
echo 再次按相同数字即可终止对应进程
echo.

set /p choice=请选择(1-3,0退出):

if %choice%==1 start "Web-Dev"          cmd /k    npm run dev
if %choice%==2 start "Android-Build"    cmd /k    npm run build:android
if %choice%==3 start "Preview-Server"   cmd /k    npm run serve
if %choice%==0 exit /b 0

goto menu

