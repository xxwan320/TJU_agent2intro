@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\Configure-Map.ps1"
set "AI4TJU_EXIT=%ERRORLEVEL%"
pause
exit /b %AI4TJU_EXIT%
