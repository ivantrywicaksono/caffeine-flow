import { config } from "dotenv";
import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";

config();

// Discord bot secret token
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName == "test") {
      interaction.reply(
        `Option 1: ${interaction.options.get("option1").value}`
      );
    }
  }
});

async function main() {
  const commands = [
    {
      name: "test",
      description: "Development-purpose command",
      options: [
        {
          name: "option1",
          description: "option one",
          type: 3,
          required: true,
        },
      ],
    },
  ];

  try {
    console.log("Started refreshing application (/) commands.");

    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    client.login(TOKEN);

    console.log("Successfully reloaded application (/) commands.");
  } catch (err) {
    console.log(err);
  }
}

main();
