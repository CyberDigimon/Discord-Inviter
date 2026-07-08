import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve('data');
const DB_PATH = path.join(DATA_DIR, 'invites.json');

const defaultData = () => ({
  members: {},
  inviteCounts: {},
});

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData(), null, 2));
  }
}

function readData() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function recordJoin({ guildId, memberId, inviterId, inviteCode }) {
  const data = readData();
  const key = `${guildId}:${memberId}`;

  data.members[key] = {
    guildId,
    memberId,
    inviterId: inviterId ?? null,
    inviteCode: inviteCode ?? null,
    joinedAt: new Date().toISOString(),
  };

  if (inviterId) {
    const countKey = `${guildId}:${inviterId}`;
    data.inviteCounts[countKey] = (data.inviteCounts[countKey] ?? 0) + 1;
  }

  writeData(data);
}

export function getMemberInvite(guildId, memberId) {
  const data = readData();
  return data.members[`${guildId}:${memberId}`] ?? null;
}

export function getInviteCount(guildId, userId) {
  const data = readData();
  return data.inviteCounts[`${guildId}:${userId}`] ?? 0;
}

export function getLeaderboard(guildId, limit = 10) {
  const data = readData();
  const prefix = `${guildId}:`;

  return Object.entries(data.inviteCounts)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, count]) => ({
      userId: key.slice(prefix.length),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getInvitedMembers(guildId, inviterId, limit = 20) {
  const data = readData();

  return Object.values(data.members)
    .filter((entry) => entry.guildId === guildId && entry.inviterId === inviterId)
    .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
    .slice(0, limit);
}
