@echo off
title Daily Sleep/Wake Setup FIXED
color 0A

echo Creating required folder...
mkdir C:\Scripts >nul 2>&1

echo Creating SleepPC.ps1...
(
echo Add-Type -AssemblyName System.Windows.Forms
echo [System.Windows.Forms.Application]::SetSuspendState('Suspend',$false,$false^)
) > C:\Scripts\SleepPC.ps1

echo Removing old tasks...
schtasks /delete /tn "Wake PC Daily" /f >nul 2>&1
schtasks /delete /tn "Sleep PC Daily" /f >nul 2>&1

echo Enabling wake timers...
powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_SLEEP RTCWAKE 1 >nul 2>&1
powercfg /SETDCVALUEINDEX SCHEME_CURRENT SUB_SLEEP RTCWAKE 1 >nul 2>&1
powercfg /SETACTIVE SCHEME_CURRENT >nul 2>&1
powercfg -h off

echo Creating Wake Task at 6:00 AM...
schtasks /create /tn "Wake PC Daily" /tr "cmd.exe /c exit" /sc daily /st 06:00 /f

powershell -NoProfile -ExecutionPolicy Bypass -Command "$task = Get-ScheduledTask -TaskName 'Wake PC Daily'; $task.Settings.WakeToRun = $true; Set-ScheduledTask -TaskName 'Wake PC Daily' -Settings $task.Settings"

echo Creating Sleep Task at 11:00 PM...
schtasks /create /tn "Sleep PC Daily" /tr "powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\Scripts\SleepPC.ps1" /sc daily /st 23:00 /f

echo.
echo Done! Your PC will sleep at 11:00 PM and wake at 6:00 AM daily.
echo.
pause