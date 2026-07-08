import { REST, Routes } from 'discord.js';
import { getConfig } from './config.js';
import { commands } from './commands.js';

let token;
let clientId;
let guildId;

try {
  ({ token, clientId, guildId } = getConfig());
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);
const body = commands.map((command) => command.toJSON());

try {
  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
    console.log(`Registered ${body.length} guild command(s) for guild ${guildId}.`);
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body });
    console.log(`Registered ${body.length} global command(s).`);
  }
} catch (error) {
  console.error('Failed to deploy commands:', error);
  process.exit(1);
}
