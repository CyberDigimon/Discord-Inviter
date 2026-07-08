# Discord Inviter

A Discord bot that tracks who invited each member, keeps invite counts, and exposes slash commands for invite stats.

## Features

- Tracks joins by comparing invite usage counts
- Stores invite history in `data/invites.json`
- Slash commands:
  - `/invite` — create or return your personal permanent invite link
  - `/invites [user]` — show how many members someone invited
  - `/leaderboard` — top inviters in the server
  - `/who-invited <member>` — show who invited a specific member

## Setup

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
