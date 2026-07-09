import { EmbedBuilder } from 'discord.js';
import { getInviteCount } from './database.js';

function inviteWord(count) {
  return count === 1 ? 'invite' : 'invites';
}

export async function notifyInviterOnJoin(client, config, { member, inviterId }) {
  if (!inviterId || inviterId === member.id) {
    return;
  }

  const totalInvites = getInviteCount(member.guild.id, inviterId);

  if (config.notifyInviterDm) {
    await sendInviterDm(client, { member, inviterId, totalInvites });
  }

  for (const channelId of config.notifyChannelIds) {
    await sendChannelNotification(client, channelId, {
      member,
      inviterId,
      totalInvites,
    });
  }
}

async function sendInviterDm(client, { member, inviterId, totalInvites }) {
  try {
    const inviter = await client.users.fetch(inviterId);
    if (inviter.bot) {
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('New invite!')
      .setDescription(
        `**${member.user.tag}** joined **${member.guild.name}** using your invite link.`,
      )
      .addFields({
        name: 'Your total invites',
        value: `**${totalInvites}** ${inviteWord(totalInvites)}`,
        inline: true,
      })
      .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
      .setFooter({ text: 'Use /invites to see your full stats.' })
      .setTimestamp();

    await inviter.send({ embeds: [embed] });
  } catch (error) {
    if (error.code === 50007) {
      console.warn(`Could not DM inviter ${inviterId}: DMs are disabled.`);
      return;
    }

    console.warn(`Could not DM inviter ${inviterId}: ${error.message}`);
  }
}

async function sendChannelNotification(client, channelId, { member, inviterId, totalInvites }) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel?.isTextBased() || channel.isDMBased()) {
      console.warn(`NOTIFY_CHANNEL_ID ${channelId} is not a text channel.`);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setDescription(
        `<@${inviterId}> got a new invite! **${member.user.tag}** joined the server.`,
      )
      .addFields({
        name: 'Total invites',
        value: `**${totalInvites}** ${inviteWord(totalInvites)}`,
        inline: true,
      })
      .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.warn(`Could not post invite notification to channel ${channelId}: ${error.message}`);
  }
}
