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
4. Copy `.env.example` to `.env` and fill in:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID` (optional, speeds up command registration during development)
5. Install dependencies and register commands:

```bash
npm install
npm run deploy-commands
npm start
```

## Required bot permissions

- Read Messages / View Channels
- Send Messages
- Create Instant Invite
- Manage Server

## Notes

- Members who joined before the bot started cannot be attributed unless they rejoin.
- The bot must be online when members join to record invite attribution accurately.
