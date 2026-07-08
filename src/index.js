import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from 'discord.js';
import { getConfig } from './config.js';
import { handleCommand } from './commands.js';
import { InviteTracker } from './inviteTracker.js';

let token;

try {
  ({ token } = getConfig());
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
  ],
  partials: [Partials.GuildMember],
});

const tracker = new InviteTracker(client);

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  await tracker.cacheAllGuilds();
  console.log(`Cached invites for ${readyClient.guilds.cache.size} guild(s).`);
});

client.on(Events.GuildCreate, async (guild) => {
  await tracker.cacheGuildInvites(guild);
});

client.on(Events.InviteCreate, async (invite) => {
  const snapshot = tracker.inviteCache.get(invite.guild?.id) ?? new Map();
  snapshot.set(invite.code, {
    uses: invite.uses ?? 0,
    inviterId: invite.inviter?.id ?? null,
  });
  tracker.inviteCache.set(invite.guild.id, snapshot);
});

client.on(Events.InviteDelete, (invite) => {
  const snapshot = tracker.inviteCache.get(invite.guild?.id);
  if (!snapshot) return;
  snapshot.delete(invite.code);
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const result = await tracker.handleMemberJoin(member);
    const inviterText = result.inviterId ? `<@${result.inviterId}>` : 'unknown';
    console.log(`Member ${member.user.tag} joined via ${result.inviteCode ?? 'unknown'} (inviter: ${inviterText})`);
  } catch (error) {
    console.error(`Failed to track invite for ${member.user.tag}:`, error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    await handleCommand(interaction);
  } catch (error) {
    console.error(`Command ${interaction.commandName} failed:`, error);
    const payload = { content: 'Something went wrong while running that command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  }
});

client.login(token).catch((error) => {
  console.error('Failed to connect to Discord:', error.message);
  process.exit(1);
});
