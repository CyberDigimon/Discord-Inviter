@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo.
echo Discord Inviter - setup checker
echo ================================
echo.
echo Checking folder:
echo %CD%
echo.

if exist ".env.txt" (
  echo [FAIL] Found .env.txt instead of .env
  echo        Windows Notepad often adds .txt when you save.
  echo        Rename .env.txt to .env ^(no extension^).
  echo.
)

if not exist ".env" (
  echo [FAIL] .env file not found in this folder.
  echo.
  if exist ".env.example" (
    echo Creating .env from .env.example now...
    copy /Y .env.example .env >nul
    if exist ".env" (
      echo [OK] Created .env
      echo      Open it and paste your DISCORD_TOKEN after the = sign.
    ) else (
      echo [FAIL] Could not create .env automatically.
      echo        Copy .env.example to .env manually.
    )
  ) else (
    echo        .env.example is also missing - re-download the project.
  )
  goto :done
)

echo [OK] .env file found
echo.

set "HAS_TOKEN=0"
set "HAS_CHANNELS=0"
set "TOKEN_LOOKS_BAD=0"

for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
  set "KEY=%%A"
  set "VAL=%%B"

  rem Trim accidental spaces around the key
  for /f "tokens=* delims= " %%K in ("!KEY!") do set "KEY=%%K"

  if /i "!KEY!"=="DISCORD_TOKEN" (
    if not "!VAL!"=="" (
      set "HAS_TOKEN=1"
      echo !VAL! | findstr /R "^[0-9][0-9]*$" >nul
      if not errorlevel 1 (
        echo [FAIL] DISCORD_TOKEN is an Application ID, not a Bot Token
        echo        Open Developer Portal -^> Bot -^> Reset Token / Copy
        echo        It must look like: xxxxx.yyyyyy.zzzzzzzz
      ) else (
        echo !VAL! | findstr /R "\." >nul
        if errorlevel 1 (
          set "TOKEN_LOOKS_BAD=1"
          echo [FAIL] DISCORD_TOKEN does not look like a Bot Token
          echo        Do NOT use Application ID, Public Key, or Client Secret
          echo        Use Bot page -^> Reset Token / Copy
          echo        A real token has two dots: xxxxx.yyyyyy.zzzzzzzz
        ) else (
          echo [OK] DISCORD_TOKEN looks like a Bot Token
        )
      )
    ) else (
      echo [FAIL] DISCORD_TOKEN is empty
      echo        Open .env and paste your Bot Token after DISCORD_TOKEN=
    )
  )

  if /i "!KEY!"=="NOTIFY_CHANNEL_IDS" (
    if not "!VAL!"=="" (
      set "HAS_CHANNELS=1"
      echo [OK] NOTIFY_CHANNEL_IDS is set
      echo      Value: !VAL!
    ) else (
      echo [WARN] NOTIFY_CHANNEL_IDS is empty ^(optional^)
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
  echo [WARN] No notification channels set ^(optional^)
  echo        To announce joins in a channel, add:
  echo        NOTIFY_CHANNEL_IDS=channel_id_1,channel_id_2
)

echo.
echo How to get a text channel ID:
echo   1. Discord Settings -^> Advanced -^> enable Developer Mode
echo   2. Right-click a TEXT channel -^> Copy Channel ID
echo   3. Paste it into .env as NOTIFY_CHANNEL_IDS=...
echo.
echo Correct .env example:
echo   DISCORD_TOKEN=your_bot_token_here
echo   NOTIFY_CHANNEL_IDS=1234567890123456789,9876543210987654321
echo.
echo Common mistakes:
echo   - Saving as .env.txt instead of .env
echo   - Editing .env.example instead of .env
echo   - Using category IDs instead of text channel IDs
echo   - Extra spaces or quotes around values
echo   - Wrong variable name like CHANNEL_ID instead of NOTIFY_CHANNEL_IDS
echo.
echo Next steps if everything above looks OK:
echo   1. Double-click install-everything.bat ^(once^)
echo   2. Double-click start-bot.bat
echo.

:done
pause
