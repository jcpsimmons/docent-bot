import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types/ISlashCommand.js";

export const rollCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice")
    .addIntegerOption(option =>
      option.setName('sides')
        .setDescription('Number of sides on the dice (default: 6)')
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(100))
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('Number of dice to roll (default: 1)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10)),

  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const count = interaction.options.getInteger('count') ?? 1;

    const rolls: number[] = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = rolls.reduce((sum, roll) => sum + roll, 0);
    const rollsText = rolls.join(', ');

    if (count === 1) {
      await interaction.reply(`🎲 You rolled a **${total}** on a ${sides}-sided die!`);
    } else {
      await interaction.reply(`🎲 You rolled ${count} ${sides}-sided dice: ${rollsText}\nTotal: **${total}**`);
    }
  },
};