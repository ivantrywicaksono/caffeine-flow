const { config } = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} = require('discord.js');

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

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.commands = new Collection();
const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);

      if (folder == 'slash') commands.push(command.data.toJSON());
      else commands.push(command.data);
    } else {
      console.error(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

client.on('interactionCreate', async (interaction) => {
  console.log(interaction);
  const command = interaction.client.commands.get(interaction.commandName);

  const isApplicationCommand =
    interaction.isChatInputCommand() ||
    interaction.isUserContextMenuCommand() ||
    interaction.isMessageContextMenuCommand();

  if (isApplicationCommand) {
    try {
      command.execute(interaction);
    } catch (err) {
      console.error(err);
    }
  }
});

async function main() {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    client.login(TOKEN);

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (err) {
    console.error(err);
  }
}

main();
