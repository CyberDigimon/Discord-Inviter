@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "NODE_VERSION=22.17.0"
set "NODE_DIR=%CD%\tools\node"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"
set "NODE_ZIP=%TEMP%\node-v%NODE_VERSION%-win-x64.zip"
set "NODE_URL=https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-win-x64.zip"
set "EXTRACT_DIR=%TEMP%\node-v%NODE_VERSION%-win-x64"

echo.
echo Discord Inviter - automatic setup
echo ===================================
echo.

if not exist "%NODE_EXE%" (
  echo Downloading Node.js into this project folder...
  echo This does NOT need a normal Node install on Windows.
  echo.

  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ProgressPreference = 'SilentlyContinue';" ^
    "Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_ZIP%';" ^
    "Expand-Archive -Path '%NODE_ZIP%' -DestinationPath '%TEMP%' -Force"

  if not exist "%EXTRACT_DIR%\node.exe" (
    echo.
    echo Failed to download Node.js.
    echo Check your internet connection and try again.
    pause
    exit /b 1
  )

  if not exist "tools" mkdir "tools"
  if exist "%NODE_DIR%" rmdir /s /q "%NODE_DIR%"
  move "%EXTRACT_DIR%" "%NODE_DIR%" >nul
  del "%NODE_ZIP%" >nul 2>nul

  echo Node.js ready in tools\node
) else (
  echo Node.js already present in tools\node
)

if not exist ".env" (
  copy /Y .env.example .env >nul
  echo Created .env from .env.example
)

echo.
echo Installing bot packages...
call "%NPM_CMD%" install
if errorlevel 1 (
  echo.
  echo npm install failed.
  pause
  exit /b 1
)

echo.
echo ===================================
echo Setup finished
echo ===================================
echo.
echo Project folder:
echo %CD%
echo.
echo Next:
echo 1. Open this folder in Cursor
echo 2. Open .env and paste your DISCORD_TOKEN after the = sign
echo 3. Double-click start-bot.bat
echo.
pause
