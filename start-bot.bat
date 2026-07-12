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

if exist ".env.txt" if not exist ".env" (
  echo.
  echo Found .env.txt instead of .env
  echo Renaming .env.txt to .env...
  ren ".env.txt" ".env"
  echo.
)

if not exist ".env" (
  echo.
  echo .env file is missing.
  echo Double-click install-everything.bat first, then add your DISCORD_TOKEN.
  echo.
  pause
  exit /b 1
)

findstr /R /C:"^DISCORD_TOKEN=..*" .env >nul
if errorlevel 1 (
  echo.
  echo Add your DISCORD_TOKEN to the .env file first.
  echo Open .env and paste the token after DISCORD_TOKEN=
  echo Then run this script again.
  echo.
  pause
  exit /b 1
)

echo.
echo Registering slash commands...
call "%NODE_DIR%\npm.cmd" run deploy-commands
if errorlevel 1 (
  echo.
  echo deploy-commands failed. Check your token in .env
  echo Tip: double-click check-setup.bat to validate the file.
  pause
  exit /b 1
)

echo.
echo Starting bot...
call "%NODE_DIR%\npm.cmd" start
if errorlevel 1 (
  echo.
  echo Bot exited with an error.
  pause
  exit /b 1
)
