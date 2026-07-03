@echo off
setlocal enabledelayedexpansion
set "folder=C:\Users\Server\Desktop\AutoUpdate Games\Process Names"

echo Game Update Automation
echo ======================
echo.

:: Initial delay for 10 minutes (600 seconds)
echo Waiting 10 minutes before starting the updates to allow the system to fully load...
timeout /t 600 >nul

:: Loop through each shortcut (.lnk) file in the folder
for %%F in ("%folder%\*.lnk") do (
    set "gameName=%%~nF"
    echo Starting update for !gameName!... 

    :: Start the game using the shortcut
    start "" "%%F"
    echo Waiting 10 minutes for !gameName! to update...
    timeout /t 600 >nul

    echo Attempting to close !gameName!...

    :: Special handling for Chrome to terminate all instances
    if /i "!gameName!"=="chrome" (
        taskkill /f /im chrome.exe /t >nul 2>&1
        echo All Chrome processes have been closed.
    ) else (
        :: Kill the corresponding process (same name as the shortcut)
        taskkill /f /im "!gameName!.exe" >nul 2>&1
        echo !gameName!.exe closed.
    )
    echo.
)

echo All games have been updated!
pause
