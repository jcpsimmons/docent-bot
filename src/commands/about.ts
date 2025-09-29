import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types/ISlashCommand.js";

export const aboutCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("What this bot does."),

  async execute(interaction) {
    await interaction.reply(
      "I'm a minimal TS bot running on Fly.io. Try /ping."
    );
  },
};