import { Client, GatewayIntentBits, Events } from "discord.js";
import http from "http";
import "dotenv/config";
const { DISCORD_TOKEN = "", CLIENT_ID = "", GUILD_ID = "", PORT = "8080", } = process.env;
if (!DISCORD_TOKEN || !CLIENT_ID) {
    throw new Error("Missing DISCORD_TOKEN or CLIENT_ID");
}
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (c) => {
    console.log(`Ready as ${c.user.tag}`);
});
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    switch (interaction.commandName) {
        case "ping":
            await interaction.reply("pong");
            break;
        case "about":
            await interaction.reply("I'm a minimal TS bot running on Fly.io. Try /ping.");
            break;
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
