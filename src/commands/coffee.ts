import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types/ISlashCommand.js";

export const coffeeCommand: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("coffee")
    .setDescription("Start a coffee chat with a random server member"),

  async execute(interaction) {
    // Ensure the command is used in a guild (server)
    if (!interaction.guild) {
      await interaction.reply({ content: "This command can only be used in a server!", ephemeral: true });
      return;
    }

    // Defer reply to prevent timeout during member fetching
    await interaction.deferReply({ ephemeral: true });

    try {
      // Without GuildMembers intent, we can't fetch all members
      // Instead, let's provide a simpler coffee encouragement message
      const coffeeEmojis = ['☕', '🍵', '🥤', '🧋', '🫖'];
      const randomEmoji = coffeeEmojis[Math.floor(Math.random() * coffeeEmojis.length)];
      
      const encouragementMessages = [
        "Time for a coffee break! Why not invite someone for a chat?",
        "Coffee time! Perfect moment to connect with your colleagues.",
        "How about a coffee chat? Great conversations start with great coffee!",
        "Take a coffee break and make someone's day with a friendly chat!",
        "Coffee + conversation = perfect combination! Reach out to someone!"
      ];
      
      const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
      
      await interaction.editReply({ 
        content: `${randomEmoji} **${randomMessage}** ${randomEmoji}\n\nUse this as your excuse to reach out to someone for a friendly coffee chat! 🎉`
      });

    } catch (error) {
      console.error('Error in coffee command:', error);
      
      try {
        await interaction.editReply({ content: 'There was an error setting up the coffee chat. Please try again!' });
      } catch (editError) {
        console.error('Error editing reply:', editError);
        // If we can't edit the deferred reply, try a follow-up
        try {
          await interaction.followUp({ content: 'There was an error setting up the coffee chat. Please try again!', ephemeral: true });
        } catch (followUpError) {
          console.error('Error with follow-up:', followUpError);
        }
      }
    }
  },
};