import "dotenv/config";
import { REST, Routes } from "discord.js";
import { commands } from "./index";

const { DISCORD_TOKEN = "", CLIENT_ID = "", GUILD_ID = "" } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID) throw new Error("Missing env");

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

async function main() {
  // Dev: register to a single guild for instant availability
  if (GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("Guild slash commands registered.");
  }

  // Prod: uncomment when ready (global can take up to ~1h to propagate)
  // await rest.put(
  //   Routes.applicationCommands(CLIENT_ID),
  //   { body: commands }
  // );
  // console.log("Global slash commands registered.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});