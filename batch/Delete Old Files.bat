@echo off

:: Set the target folder
set folder=E:\CCTV Records

:: Run PowerShell to delete files and count them
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-ChildItem -Path '%folder%' -Recurse -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | ForEach-Object { Remove-Item -LiteralPath $_.FullName -Force; $_ } | Measure-Object | Select -ExpandProperty Count"') do set count=%%i

echo Files deleted: %count%

pause
