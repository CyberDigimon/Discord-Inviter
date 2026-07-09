import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve('.env');

if (fs.existsSync(envPath)) {
  const { config } = await import('dotenv');
  config({ path: envPath });
}

function getClientIdFromToken(token) {
  const clientId = token.split('.')[0];
  if (!clientId || !/^\d+$/.test(clientId)) {
    throw new Error('DISCORD_TOKEN looks invalid. Use the full bot token from the Developer Portal.');
  }
  return clientId;
}

export function getConfig() {
  const token = process.env.DISCORD_TOKEN?.trim();

  if (!token) {
    throw new Error(
      'DISCORD_TOKEN is not set. Export it as an environment variable or put it in a local .env file (never commit that file).',
    );
  }

  const notifyInviterDm = process.env.NOTIFY_INVITER_DM?.trim().toLowerCase() !== 'false';
  const notifyChannelId = process.env.NOTIFY_CHANNEL_ID?.trim() || undefined;

  return {
    token,
    clientId: getClientIdFromToken(token),
    guildId: process.env.GUILD_ID?.trim() || undefined,
    notifyInviterDm,
    notifyChannelId,
  };
}
