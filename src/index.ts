import { Client, GatewayIntentBits, Events, REST, Routes } from "discord.js";
import http from "http";
import "dotenv/config";

const {
  DISCORD_TOKEN = "",
  CLIENT_ID = "",
  GUILD_ID = "",
  PORT = "8080",
} = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  throw new Error("Missing DISCORD_TOKEN or CLIENT_ID");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

import { getCommand } from "./commands/index.js";

client.once(Events.ClientReady, (c) => {
  console.log(`Ready as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = getCommand(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Tiny HTTP health server so Fly keeps the machine warm
http
  .createServer((_, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  })
  .listen(Number(PORT), () => console.log(`Health on :${PORT}`));

client.login(DISCORD_TOKEN);
