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

echo Installing bot packages...
call install-everything.bat
