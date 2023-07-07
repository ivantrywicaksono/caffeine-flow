const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('channel')
  .setDescription('Write the channel into a message')
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('Select the channel')
      .setRequired(true)
  );

async function execute(interaction) {
  await interaction.reply({
    content: `<#${interaction.options.get('channel').value}>`,
  });
}

module.exports = { data, execute };
