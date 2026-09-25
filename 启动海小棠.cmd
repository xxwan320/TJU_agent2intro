@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\Judge-Start.ps1"
set "AI4TJU_EXIT=%ERRORLEVEL%"
if not "%AI4TJU_EXIT%"=="0" pause
exit /b %AI4TJU_EXIT%
