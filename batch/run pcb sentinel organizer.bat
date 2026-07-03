@echo off
title PCB Sentinel Organizer v1.3.0 Stable
color 0A

echo ============================================
echo     PCB Sentinel Organizer v1.3.0 Stable
echo ============================================
echo.

echo [1/3] Initializing...
timeout /t 1 > nul

cd /d "%~dp0"

echo [2/3] Starting local server...
start "PCB Sentinel Server" cmd /k python app.py
timeout /t 3 > nul

echo [3/3] Opening dashboard...
start http://127.0.0.1:5000

timeout /t 2 >nul
exit