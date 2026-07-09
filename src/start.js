import { deployCommands } from './deployCommands.js';

try {
  await deployCommands();
} catch (error) {
  console.error('Failed to deploy commands:', error);
  process.exit(1);
}

await import('./index.js');
