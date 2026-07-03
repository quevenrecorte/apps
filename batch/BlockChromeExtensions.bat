@echo off

reg add "HKLM\SOFTWARE\Policies\Google\Chrome\ExtensionInstallBlocklist" /v 1 /t REG_SZ /d * /f

echo.
echo Chrome extensions are now blocked.
pause