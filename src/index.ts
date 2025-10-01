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

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

// Track bot readiness
let isReady = false;
let lastError: string | null = null;

// Tiny HTTP health server so Fly keeps the machine warm
const server = http.createServer((_, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});

server.listen(Number(PORT), () => console.log(`Health on :${PORT}`));

// Enhanced error handling
client.on('ready', () => {
  isReady = true;
  lastError = null;
});

client.on('error', (error) => {
  console.error('Discord client error:', error);
  lastError = error.message;
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  server.close();
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close();
  client.destroy();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  lastError = error.message;
  // Don't exit immediately, let health checks handle it
});

client.login(DISCORD_TOKEN).catch(error => {
  console.error('Failed to login to Discord:', error);
  lastError = error.message;
  // Keep the health server running even if Discord login fails
});
