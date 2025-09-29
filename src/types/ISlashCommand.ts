import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

/**
 * Interface that all slash commands must implement
 */
export interface ISlashCommand {
  /** The command definition (name, description, options, etc.) */
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  
  /** The function that executes when the command is used */
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}