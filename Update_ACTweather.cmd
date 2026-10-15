@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
 echo Node.js is required. Install from https://nodejs.org/ then try again.
 pause
 exit /b 1
)
node "%~dp0scripts\update-release.mjs"
pause
