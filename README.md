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

### Host from iPhone (no laptop)

Use **Railway** or **Square Cloud** in Safari. The bot registers slash commands automatically when it starts, so you only need to set your token.

#### Railway (recommended)

1. Open [railway.app](https://railway.app) and sign in with **GitHub**.
2. **New Project** → **Deploy from GitHub repo** → choose `CyberDigimon/Discord-Inviter`.
3. Pick branch `cursor/auto-invite-notifications-6f47` (or `main` after merging the notifications PR).
4. Open the service → **Variables** and add:
   - `DISCORD_TOKEN` = your bot token
   - `GUILD_ID` = your Discord server ID (slash commands show up instantly)
5. Railway runs `npm start` automatically. Wait until the deploy shows **Active**.

#### Square Cloud

1. Download the latest branch ZIP from GitHub.
2. Open [squarecloud.app](https://squarecloud.app) → upload the ZIP.
3. Add `DISCORD_TOKEN` (and optional `GUILD_ID`) in the app settings.
4. Start the app. `squarecloud.config` is already included.

#### Before the bot goes online

In the [Discord Developer Portal](https://discord.com/developers/applications):

1. **Bot** → enable **Server Members Intent**.
2. **OAuth2 → URL Generator** → scopes: `bot` + `applications.commands`.
3. Bot permissions: **Manage Server**, **Send Messages**, **Create Instant Invite**.
4. Open the invite link and add the bot to your server.

#### Test in Discord

- `/invite` — get your personal invite link
- Have someone join with that link — you should get a DM with your new total
- `/invites` and `/leaderboard` — check stats

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
- `NOTIFY_CHANNEL_ID` — channel ID where the bot posts public invite announcements (leave unset to skip)

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

## Notes

- Members who joined before the bot started cannot be attributed unless they rejoin.
- The bot must be online when members join to record invite attribution accurately.
- Inviters must allow DMs from server members (or have DMs open to the bot) to receive automatic notifications.
