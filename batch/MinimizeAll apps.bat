@echo off
:: Wait for 180 seconds (3 minutes)
timeout /t 180 /nobreak >nul

:: Minimize all windows
PowerShell -Command "(New-Object -ComObject Shell.Application).MinimizeAll()"

:: Minimize CMS Client
powershell -command "&{(Get-Process -Name 'CMSClient').MainWindowHandle | ForEach-Object { $sig = '[DllImport(\"user32.dll\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);'; $type = Add-Type -MemberDefinition $sig -Name 'Win32' -Namespace 'Win32Functions' -PassThru; $type::ShowWindow($_, 2) }}"

exit
