import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types/ISlashCommand.js";

/**
 * Template for creating new slash commands
 * 
 * Instructions:
 * 1. Copy this file and rename it to your command name (e.g., hello.ts)
 * 2. Update the export name (e.g., helloCommand)
 * 3. Update the command name and description
 * 4. Implement your execute function
 * 5. Add your command to src/commands/index.ts
 * 6. Run `npm run register` to register with Discord
 */
export const templateCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("template")
    .setDescription("Template command - replace with your command description")
    // Add options here if needed:
    // .addStringOption(option =>
    //   option.setName('input')
    //     .setDescription('Some input')
    //     .setRequired(true))
    ,

  async execute(interaction) {
    // Implement your command logic here
    await interaction.reply("This is a template command!");
  },
};