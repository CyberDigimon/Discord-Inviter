import { recordJoin } from './database.js';

export class InviteTracker {
  constructor(client) {
    this.client = client;
    this.inviteCache = new Map();
  }

  cacheKey(guildId, code) {
    return `${guildId}:${code}`;
  }

  async cacheGuildInvites(guild) {
    const invites = await guild.invites.fetch();
    const snapshot = new Map();

    for (const invite of invites.values()) {
      snapshot.set(invite.code, {
        uses: invite.uses ?? 0,
        inviterId: invite.inviter?.id ?? null,
      });
    }

    this.inviteCache.set(guild.id, snapshot);
  }

  async cacheAllGuilds() {
    for (const guild of this.client.guilds.cache.values()) {
      try {
        await this.cacheGuildInvites(guild);
      } catch (error) {
        console.warn(`Could not cache invites for guild ${guild.id}: ${error.message}`);
      }
    }
  }

  async resolveInviter(guild, member) {
    const previous = this.inviteCache.get(guild.id) ?? new Map();
    const currentInvites = await guild.invites.fetch();
    let matchedInvite = null;

    for (const invite of currentInvites.values()) {
      const prior = previous.get(invite.code);
      const priorUses = prior?.uses ?? 0;
      const currentUses = invite.uses ?? 0;

      if (currentUses > priorUses) {
        matchedInvite = invite;
        break;
      }
    }

    const snapshot = new Map();
    for (const invite of currentInvites.values()) {
      snapshot.set(invite.code, {
        uses: invite.uses ?? 0,
        inviterId: invite.inviter?.id ?? null,
      });
    }
    this.inviteCache.set(guild.id, snapshot);

    if (!matchedInvite) {
      return { inviterId: null, inviteCode: null };
    }

    return {
      inviterId: matchedInvite.inviter?.id ?? null,
      inviteCode: matchedInvite.code,
    };
  }

  async handleMemberJoin(member) {
    const { inviterId, inviteCode } = await this.resolveInviter(member.guild, member);

    recordJoin({
      guildId: member.guild.id,
      memberId: member.id,
      inviterId,
      inviteCode,
    });

    return { inviterId, inviteCode };
  }
}
