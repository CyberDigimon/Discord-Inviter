@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo.
echo Discord Inviter - setup checker
echo ================================
echo.

if not exist ".env" (
  echo [FAIL] .env file not found in this folder.
  echo        Create it by copying .env.example to .env
  goto :done
)

echo [OK] .env file found
echo.

set "HAS_TOKEN=0"
set "HAS_CHANNELS=0"
set "CHANNEL_COUNT=0"

for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
  set "KEY=%%A"
  set "VAL=%%B"

  if /i "!KEY!"=="DISCORD_TOKEN" (
    if not "!VAL!"=="" (
      set "HAS_TOKEN=1"
      echo [OK] DISCORD_TOKEN is set
    ) else (
      echo [FAIL] DISCORD_TOKEN is empty
    )
  )

  if /i "!KEY!"=="NOTIFY_CHANNEL_IDS" (
    if not "!VAL!"=="" (
      set "HAS_CHANNELS=1"
      echo [OK] NOTIFY_CHANNEL_IDS is set
      echo      Value: !VAL!
    ) else (
      echo [WARN] NOTIFY_CHANNEL_IDS is empty
    )
  )

  if /i "!KEY!"=="NOTIFY_CHANNEL_ID" (
    if not "!VAL!"=="" (
      set "HAS_CHANNELS=1"
      echo [OK] NOTIFY_CHANNEL_ID is set
      echo      Value: !VAL!
    )
  )

  if /i "!KEY!"=="CLIENT_ID" (
    echo [WARN] CLIENT_ID is not needed - you can remove this line
  )

  if /i "!KEY!"=="BOT_ID" (
    echo [WARN] BOT_ID is not needed - you can remove this line
  )

  if /i "!KEY!"=="CATEGORY_ID" (
    echo [FAIL] CATEGORY_ID will not work - use text channel IDs instead
  )
)

if "%HAS_TOKEN%"=="0" (
  echo [FAIL] DISCORD_TOKEN line missing from .env
)

if "%HAS_CHANNELS%"=="0" (
  echo [WARN] No notification channels set
  echo        Add: NOTIFY_CHANNEL_IDS=1524381790629007451,1524381705383706676
)

echo.
echo Your channel IDs should be:
echo   1524381790629007451
echo   1524381705383706676
echo.
echo Correct .env example:
echo   DISCORD_TOKEN=your_token_here
echo   NOTIFY_CHANNEL_IDS=1524381790629007451,1524381705383706676
echo.
echo Common mistakes:
echo   - Putting IDs in .env.example instead of .env
echo   - Using category IDs instead of channel IDs
echo   - Extra spaces or quotes around values
echo   - Wrong variable name like CHANNEL_ID instead of NOTIFY_CHANNEL_IDS
echo.

:done
pause
