const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('test')
  .setDescription('Development-purpose command')
  .addStringOption((option) =>
    option.setName('option1').setDescription('option one').setRequired(true)
  );

const wait = require('node:timers/promises').setTimeout;

async function execute(interaction) {
  await interaction.deferReply();
  await wait(4000);
  await interaction.editReply({
    content: `Option 1: ${interaction.options.get('option1').value}`,
  });
}

module.exports = { data, execute };
