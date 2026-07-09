import { REST, Routes } from 'discord.js';
import { getConfig } from './config.js';
import { commands } from './commands.js';

export async function deployCommands() {
  const { token, clientId, guildId } = getConfig();
  const rest = new REST({ version: '10' }).setToken(token);
  const body = commands.map((command) => command.toJSON());

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
    console.log(`Registered ${body.length} guild command(s) for guild ${guildId}.`);
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), { body });
  console.log(`Registered ${body.length} global command(s).`);
}
