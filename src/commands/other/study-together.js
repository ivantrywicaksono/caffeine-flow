const data = {
  name: 'Study Together',
  type: 2,
};

async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channelId;
  console.log(interaction.member);
  console.log(interaction.member.id);
  const user = interaction.user.id;
  const targetUser = interaction.targetId;
  let message = `<@${user}> invites <@${targetUser}> to study together`;
  console.log(voiceChannel);
  if (voiceChannel) {
    message += ` on <#${voiceChannel}>`;
  }
  await interaction.reply({
    content: message,
    ephemeral: true,
  });
}

module.exports = { data, execute };
