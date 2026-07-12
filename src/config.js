import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve('.env');

if (fs.existsSync(envPath)) {
  const { config } = await import('dotenv');
  config({ path: envPath });
}

function cleanSecret(value) {
  return value
    ?.trim()
    .replace(/^['"]|['"]$/g, '')
    .trim();
}

function getClientIdFromToken(token) {
  // Application ID / snowflake pasted by mistake (digits only, no dots)
  if (/^\d{17,20}$/.test(token)) {
    throw new Error(
      'DISCORD_TOKEN is set to an Application ID. Use the Bot Token instead (Bot page → Reset Token / Copy). It looks like: xxxxx.yyyyyy.zzzzzzzz',
    );
  }

  // Public key is a long hex string
  if (/^[0-9a-f]{32,}$/i.test(token) && !token.includes('.')) {
    throw new Error(
      'DISCORD_TOKEN is set to the Public Key. Use the Bot Token instead (Bot page → Reset Token / Copy).',
    );
  }

  const parts = token.split('.');
  const [encodedId] = parts;
  if (!encodedId || parts.length < 3) {
    throw new Error(
      'DISCORD_TOKEN looks invalid. Paste the full Bot Token from Developer Portal → Bot (not Application ID, Public Key, or Client Secret). It has two dots.',
    );
  }

  try {
    const padded = encodedId + '='.repeat((4 - (encodedId.length % 4)) % 4);
    const clientId = Buffer.from(padded, 'base64url').toString('utf8').trim();
    if (!/^\d{17,20}$/.test(clientId)) {
      throw new Error('invalid');
    }
    return clientId;
  } catch {
    throw new Error(
      'DISCORD_TOKEN looks invalid. Paste the full Bot Token from Developer Portal → Bot (not Application ID, Public Key, or Client Secret).',
    );
  }
}

export function getConfig() {
  const token = cleanSecret(process.env.DISCORD_TOKEN);

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
