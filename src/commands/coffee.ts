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
      // Fetch all guild members
      await interaction.guild.members.fetch();
      
      // Get all members excluding bots and the requester
      const eligibleMembers = interaction.guild.members.cache.filter(
        member => !member.user.bot && member.id !== interaction.user.id
      );

      // Check if there are any eligible members
      if (eligibleMembers.size === 0) {
        await interaction.editReply({ content: "There are no other members available for a coffee chat!" });
        return;
      }

      // Randomly select a member
      const randomMember = eligibleMembers.random();
      if (!randomMember) {
        await interaction.editReply({ content: "Could not find a member for coffee chat. Please try again!" });
        return;
      }

      // Create a group DM with the requester, selected member, and bot
      try {
        // First, update the deferred reply
        await interaction.editReply({ content: `☕ Setting up a coffee chat with ${randomMember.displayName}...` });

        // Try to create DMs with both users
        const requesterDM = await interaction.user.createDM();
        const selectedMemberDM = await randomMember.user.createDM();

        // Send coffee chat messages to both users
        const coffeeMessage = `☕ **Coffee Chat Time!** ☕\n\nHey there! It's time for a spontaneous coffee chat! 🎉\n\n**${interaction.user.displayName}** and **${randomMember.displayName}**, you've been randomly paired up for a friendly conversation.\n\nWhy not grab a coffee (or your favorite beverage) and have a chat? This is a great opportunity to:\n• Get to know each other better\n• Share what you're working on\n• Exchange ideas and experiences\n• Just have a friendly conversation!\n\nEnjoy your coffee chat! ☕✨`;

        await requesterDM.send(coffeeMessage);
        await selectedMemberDM.send(coffeeMessage);

        // Send a follow-up to confirm success
        await interaction.editReply({ content: `✅ Coffee chat started! Check your DMs - you've been paired with ${randomMember.displayName}!` });

      } catch (dmError) {
        console.error('Error creating DMs:', dmError);
        // If DMs fail, fall back to a public message by editing the reply
        await interaction.editReply({ 
          content: `☕ **Coffee Chat Time!** ☕\n\n${interaction.user} and ${randomMember}, you've been randomly paired for a coffee chat! Why not grab a coffee and have a friendly conversation? 🎉`
        });
      }

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