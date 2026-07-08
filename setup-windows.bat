@echo off
setlocal EnableExtensions

set "TARGET=%USERPROFILE%\Documents\Discord-Inviter"
set "REPO=https://github.com/CyberDigimon/Discord-Inviter.git"

echo.
echo Discord Inviter - fresh setup in Documents
echo ==========================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo Git is not installed. Install it from https://git-scm.com/download/win
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install it from https://nodejs.org
  pause
  exit /b 1
)

if exist "%TARGET%" (
  echo Removing old copy at:
  echo %TARGET%
  rmdir /s /q "%TARGET%"
)

echo Cloning repository to Documents...
git clone "%REPO%" "%TARGET%"
if errorlevel 1 (
  echo Failed to clone the repository.
  pause
  exit /b 1
)

cd /d "%TARGET%"

if not exist ".env" (
  copy /Y .env.example .env >nul
  echo Created .env from .env.example
)

echo Installing npm packages...
call npm install
if errorlevel 1 (
  echo npm install failed.
  pause
  exit /b 1
)

echo.
echo Setup complete.
echo.
echo Project folder:
echo %TARGET%
echo.
echo Next steps:
echo 1. Open Cursor
echo 2. File -^> Open Folder -^> choose the folder above
echo 3. Open the .env file and paste your DISCORD_TOKEN after the = sign
echo 4. In the terminal run: npm run deploy-commands
echo 5. Then run: npm start
echo.
echo Your token stays in .env on your PC only. It is not uploaded to GitHub.
echo.
pause
