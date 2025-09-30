import { ISlashCommand } from "../types/ISlashCommand.js";

// Import individual commands
import { aboutCommand } from "./about.js";
import { coffeeCommand } from "./coffee.js";
import { pingCommand } from "./ping.js";
import { rollCommand } from "./roll.js";

/**
 * Central registry of all slash commands
 * 
 * To add a new command:
 * 1. Create a new file in this directory (e.g., mycommand.ts)
 * 2. Implement the ISlashCommand interface
 * 3. Import it above and add it to the commands array below
 * 4. Run `npm run register` to register the command with Discord
 */
export const commands: ISlashCommand[] = [
  aboutCommand,
  coffeeCommand,
  pingCommand,
  rollCommand,
  // Add new commands here in alphabetical order to minimize merge conflicts
];

/**
 * Get command data for Discord API registration
 */
export const commandData = commands.map(command => command.data.toJSON());

/**
 * Get a command by name for execution
 */
export function getCommand(name: string): ISlashCommand | undefined {
  return commands.find(command => command.data.name === name);
}