@echo off

reg delete "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallBlocklist" /f

echo.
echo Chrome extension block removed.
pause