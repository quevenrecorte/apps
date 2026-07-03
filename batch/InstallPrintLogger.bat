@echo off
title Print Logger Installer - RTech Liloan

echo =====================================
echo Installing Print Logger - RTech Liloan
echo =====================================

if not exist "C:\PrintLogs" mkdir "C:\PrintLogs"

wevtutil sl Microsoft-Windows-PrintService/Operational /e:true

(
echo $csvLocal = "C:\PrintLogs\PrintHistory.csv"
echo $csvDrive = "G:\My Drive\PrintLogs\RTech Liloan\PrintHistory.csv"
echo $driveFolder = "G:\My Drive\PrintLogs\RTech Liloan"
echo.
echo $logs = Get-WinEvent -LogName "Microsoft-Windows-PrintService/Operational" ^|
echo Where-Object { $_.Id -eq 307 } ^|
echo Select-Object TimeCreated, Message
echo.
echo $logs ^| Export-Csv $csvLocal -NoTypeInformation
echo.
echo if (Test-Path $driveFolder^) {
echo     $logs ^| Export-Csv $csvDrive -NoTypeInformation
echo }
) > "C:\PrintLogs\PrintLogger.ps1"

schtasks /Delete /TN "PrintLogger" /F >nul 2>&1

schtasks /Create ^
/TN "PrintLogger" ^
/SC MINUTE ^
/MO 5 ^
/TR "powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -File C:\PrintLogs\PrintLogger.ps1" ^
/RL HIGHEST ^
/F

schtasks /Run /TN "PrintLogger"

echo.
echo =====================================
echo Installation Complete
echo =====================================
echo Script:
echo C:\PrintLogs\PrintLogger.ps1
echo.
echo Local CSV:
echo C:\PrintLogs\PrintHistory.csv
echo.
echo Google Drive CSV:
echo G:\My Drive\PrintLogs\RTech Liloan\PrintHistory.csv
echo.
echo Task:
echo PrintLogger
echo Runs every 5 minutes, hidden.
echo =====================================
pause