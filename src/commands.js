import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import {
  getInviteCount,
  getInvitedMembers,
  getLeaderboard,
  getMemberInvite,
} from './database.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Create or show your personal invite link'),
  new SlashCommandBuilder()
    .setName('invites')
    .setDescription('Show how many members someone has invited')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Member to check')
        .setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the top inviters in this server'),
  new SlashCommandBuilder()
    .setName('who-invited')
    .setDescription('Show who invited a member')
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('Member to look up')
        .setRequired(true),
    ),
];

export async function handleCommand(interaction) {
  const { commandName, guild, member } = interaction;
  if (!guild) {
    await interaction.reply({
      content: 'This command can only be used inside a server.',
      ephemeral: true,
    });
    return;
  }

  if (commandName === 'invite') {
    await handleInviteCommand(interaction);
    return;
  }

  if (commandName === 'invites') {
    const target = interaction.options.getUser('user') ?? interaction.user;
    const count = getInviteCount(guild.id, target.id);
    const invited = getInvitedMembers(guild.id, target.id, 5);

    const lines = invited.length
      ? invited.map((entry) => `<@${entry.memberId}> (${entry.inviteCode ?? 'unknown'})`).join('\n')
      : 'No tracked invites yet.';

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${target.username}'s invites`)
      .setDescription(`**Total invites:** ${count}`)
      .addFields({ name: 'Recent joins', value: lines });

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (commandName === 'leaderboard') {
    const rows = getLeaderboard(guild.id, 10);

    const description = rows.length
      ? rows
          .map((row, index) => `**${index + 1}.** <@${row.userId}> — ${row.count} invite(s)`)
          .join('\n')
      : 'No invites tracked yet.';

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('Invite leaderboard')
      .setDescription(description);

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (commandName === 'who-invited') {
    const target = interaction.options.getUser('member', true);
    const record = getMemberInvite(guild.id, target.id);

    if (!record) {
      await interaction.reply({
        content: `No invite record found for ${target}. They may have joined before tracking started.`,
        ephemeral: true,
      });
      return;
    }

    const inviterText = record.inviterId ? `<@${record.inviterId}>` : 'Unknown';
    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle(`Who invited ${target.username}?`)
      .addFields(
        { name: 'Inviter', value: inviterText, inline: true },
        { name: 'Invite code', value: record.inviteCode ?? 'Unknown', inline: true },
        { name: 'Joined at', value: `<t:${Math.floor(new Date(record.joinedAt).getTime() / 1000)}:R>`, inline: true },
      );

    await interaction.reply({ embeds: [embed] });
  }
}

async function handleInviteCommand(interaction) {
  const channel = interaction.channel;
  if (!channel || !channel.isTextBased() || channel.isDMBased()) {
    await interaction.reply({
      content: 'I need a server text channel to create an invite link.',
      ephemeral: true,
    });
    return;
  }

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.CreateInstantInvite)) {
    await interaction.reply({
      content: 'You need permission to create invites in this channel.',
      ephemeral: true,
    });
    return;
  }

  const existing = (await interaction.guild.invites.fetch()).find(
    (invite) => invite.inviter?.id === interaction.user.id && invite.maxAge === 0,
  );

  const invite =
    existing ??
    (await channel.createInvite({
      maxAge: 0,
      maxUses: 0,
      unique: true,
      reason: `Personal invite for ${interaction.user.tag}`,
    }));

  await interaction.reply({
    content: `Here is your invite link: https://discord.gg/${invite.code}`,
    ephemeral: true,
  });
}
