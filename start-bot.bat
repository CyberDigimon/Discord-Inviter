@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "NODE_DIR=%CD%\tools\node"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

if not exist "%NODE_DIR%\node.exe" (
  echo Node is not installed in this project yet.
  echo Double-click install-everything.bat first.
  pause
  exit /b 1
)

if not exist ".env" (
  echo .env file is missing.
  echo Double-click install-everything.bat first.
  pause
  exit /b 1
)

findstr /R /C:"^DISCORD_TOKEN=..*" .env >nul
if errorlevel 1 (
  echo.
  echo Your .env file does not have a DISCORD_TOKEN yet.
  echo Open .env and paste your bot token after DISCORD_TOKEN=
  echo.
  pause
  exit /b 1
)

echo Registering slash commands...
call "%NPM_CMD%" run deploy-commands
if errorlevel 1 (
  echo deploy-commands failed. Check your token in .env
  pause
  exit /b 1
)

echo.
echo Starting bot...
call "%NPM_CMD%" start
