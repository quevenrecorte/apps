@echo off
title PCB Sentinel v1.6 Stable
color 0A

echo ============================================
echo           PCB Sentinel v1.6 Stable
echo ============================================
echo.

echo [1/5] Initializing...
timeout /t 1 > nul

cd /d "%~dp0"

echo [2/5] Scanning PCB projects...
python scanner.py
timeout /t 1 > nul

echo [3/5] Updating database...
timeout /t 1 > nul

echo [4/5] Starting local server...
start "PCB Sentinel Server" cmd /k python app.py
timeout /t 3 > nul

echo [5/5] Opening dashboard...
REM start http://127.0.0.1:8080

timeout /t 2 >nul
exit