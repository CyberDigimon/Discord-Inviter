@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "NODE_DIR=%CD%\tools\node"
set "PATH=%NODE_DIR%;%PATH%"

if not exist "%NODE_DIR%\node.exe" (
  echo.
  echo Portable Node.js is missing.
  echo Double-click install-everything.bat first.
  echo.
  pause
  exit /b 1
)

if not exist ".env" (
  echo.
  echo .env file is missing.
  echo Double-click install-everything.bat first.
  echo.
  pause
  exit /b 1
)

findstr /R /C:"^DISCORD_TOKEN=..*" .env >nul
if errorlevel 1 (
  echo.
  echo Add your DISCORD_TOKEN to the .env file first.
  echo.
  pause
  exit /b 1
)

echo.
echo Registering slash commands...
call npm run deploy-commands
if errorlevel 1 (
  echo.
  echo deploy-commands failed. Check your token in .env
  pause
  exit /b 1
)

echo.
echo Starting bot...
call npm start
