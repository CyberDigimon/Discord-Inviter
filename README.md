# Discord Inviter

A Discord bot that tracks who invited each member, keeps invite counts, and exposes slash commands for invite stats.

## Features

- Tracks joins by comparing invite usage counts
- **Automatically DMs inviters** when someone joins using their invite link, with their updated total
- Optionally posts invite announcements to a server channel
- Stores invite history in `data/invites.json`
- Slash commands:
  - `/invite` — create or return your personal permanent invite link
  - `/invites [user]` — show how many members someone invited
  - `/leaderboard` — top inviters in the server
  - `/who-invited <member>` — show who invited a specific member

## Setup

### Windows quick setup (no Node install needed)

If `npm` is not recognized on your PC, use the automatic setup instead.

1. Open this folder:
   ```
   C:\Users\Ollie\Documents\Discord-Inviter
   ```
2. Double-click:
   ```
   install-everything.bat
   ```
3. Wait until it says **Setup finished**
4. Open `.env` and paste your `DISCORD_TOKEN`
5. Optionally add notification channels:
   ```
   NOTIFY_CHANNEL_IDS=channel_id_1,channel_id_2
   ```
6. Double-click:
   ```
   start-bot.bat
   ```

This downloads Node.js into the project folder at `tools\node`, so you do **not** need to install Node on Windows yourself.

### Windows quick setup (Documents folder)

1. Download or clone this repo.
2. Double-click `setup-windows.bat`.
3. It installs a fresh copy to:
   ```
   C:\Users\YourName\Documents\Discord-Inviter
   ```
4. Open that folder in Cursor, edit `.env`, and add your `DISCORD_TOKEN`.
5. Run:
   ```bash
   npm run deploy-commands
   npm start
   ```

### Manual setup

1. Create a bot in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Enable these **Privileged Gateway Intents**:
   - Server Members Intent
3. Invite the bot with permissions to:
   - Manage Server (for invite tracking)
   - Create Instant Invite
   - Use Application Commands
4. Set your bot token as an environment variable (do **not** commit it to GitHub):

```bash
export DISCORD_TOKEN="your_bot_token_here"
```

The application/client ID is derived automatically from the token, so you do not need a separate `CLIENT_ID` config.

For local development, you can copy `.env.example` to `.env` and add your token there instead. That file is gitignored.

Optional: set `GUILD_ID` as an environment variable if you want slash commands to register instantly in one server during development. Leave it unset to register commands globally.

Optional notification settings:

- `NOTIFY_INVITER_DM` — set to `false` to turn off automatic DMs to inviters (on by default)
- `NOTIFY_CHANNEL_IDS` — comma-separated text channel IDs for invite announcements
- `NOTIFY_CHANNEL_ID` — single channel ID (still works if you only need one)

5. Install dependencies and register commands:

```bash
npm install
npm run deploy-commands
npm start
```

## Keeping secrets safe on a public repo

- Never commit `.env` or paste tokens/IDs into tracked files.
- Only `DISCORD_TOKEN` is required. The bot reads it from environment variables or a local `.env` file.
- `.env`, `.env.*`, and `secrets/` are gitignored.
- If a token is ever exposed, reset it immediately in the Discord Developer Portal.

## Required bot permissions

- Read Messages / View Channels
- Send Messages
- Create Instant Invite
- Manage Server

## Let other servers use your bot

To let **other people add your bot to their servers**, you need to:

1. **Host the bot online 24/7** (your PC only works while it is turned on and `start-bot.bat` is running).
2. **Share an invite link** so server owners can add the bot.

### Create your bot invite link

1. Open the [Discord Developer Portal](https://discord.com/developers/applications).
2. Select your app → **OAuth2 → URL Generator**.
3. Under **Scopes**, check:
   - `bot`
   - `applications.commands`
4. Under **Bot Permissions**, check:
   - View Channels
   - Send Messages
   - Create Instant Invite
   - Manage Server
5. Copy the generated URL at the bottom and share it.

Anyone with that link can add the bot to their server. Slash commands work in every server the bot is in.

### Host online (recommended)

**Railway / Render / a VPS** — set `DISCORD_TOKEN` as an environment variable on the host (never in GitHub).

With Docker:

```bash
docker compose up -d
```

Make sure `.env` exists locally on the server with at least:

```
DISCORD_TOKEN=your_bot_token_here
```

Optional notification channels in `.env` only apply to **your** server. Other servers still get slash commands and inviter DMs.

### Windows self-host (your PC)

1. `git pull`
2. Double-click `install-everything.bat` (only needed once)
3. Edit `.env` with your token
4. Double-click `start-bot.bat`

## Notes

- Members who joined before the bot started cannot be attributed unless they rejoin.
- The bot must be online when members join to record invite attribution accurately.
- Inviters must allow DMs from server members (or have DMs open to the bot) to receive automatic notifications.
