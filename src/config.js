import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve('.env');

if (fs.existsSync(envPath)) {
  const { config } = await import('dotenv');
  config({ path: envPath });
}

function getClientIdFromToken(token) {
  const [encodedId] = token.split('.');
  if (!encodedId || token.split('.').length < 3) {
    throw new Error('DISCORD_TOKEN looks invalid. Use the full bot token from the Developer Portal.');
  }

  try {
    const clientId = Buffer.from(encodedId, 'base64').toString('utf8').trim();
    if (!/^\d{17,20}$/.test(clientId)) {
      throw new Error('invalid');
    }
    return clientId;
  } catch {
    throw new Error('DISCORD_TOKEN looks invalid. Use the full bot token from the Developer Portal.');
  }
}

export function getConfig() {
  const token = process.env.DISCORD_TOKEN?.trim();

  if (!token) {
    throw new Error(
      'DISCORD_TOKEN is not set. Export it as an environment variable or put it in a local .env file (never commit that file).',
    );
  }

  const notifyInviterDm = process.env.NOTIFY_INVITER_DM?.trim().toLowerCase() !== 'false';
  const notifyChannelIds = parseChannelIds(
    process.env.NOTIFY_CHANNEL_IDS,
    process.env.NOTIFY_CHANNEL_ID,
  );

  return {
    token,
    clientId: getClientIdFromToken(token),
    guildId: process.env.GUILD_ID?.trim() || undefined,
    notifyInviterDm,
    notifyChannelIds,
  };
}

function parseChannelIds(multiValue, singleValue) {
  const raw = multiValue?.trim() || singleValue?.trim();
  if (!raw) {
    return [];
  }

  return [
    ...new Set(
      raw
        .split(/[,\s]+/)
        .map((id) => id.trim())
        .filter((id) => /^\d{17,20}$/.test(id)),
    ),
  ];
}
