import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types/ISlashCommand.js";

export const pingCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong."),

  async execute(interaction) {
    await interaction.reply("pong");
  },
};