@echo off
title NearNest Fullstack Runner
echo ===================================================
echo           Starting NearNest Fullstack Application
echo ===================================================
echo.

:: 1. Start Backend Server
echo [1/3] Starting Backend Server (Port 5000)...
start "NearNest Backend (Port 5000)" cmd /k "cd /d %~dp0server && npm.cmd run dev"

:: Wait 2 seconds
timeout /t 2 /nobreak >nul

:: 2. Start Frontend Vite Client
echo [2/3] Starting Frontend Client (Port 5173)...
start "NearNest Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm.cmd run dev"

:: Wait 3 seconds
timeout /t 3 /nobreak >nul

:: 3. Open Web Browser
echo [3/3] Opening NearNest in your default browser...
start http://localhost:5173

echo.
echo ===================================================
echo  NearNest is now running!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:5000
echo ===================================================
