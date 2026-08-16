const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CatchMailAPI = require('../../utils/catchmail');
const { t } = require('../../languages');

// CatchMail Bot Colors - Blue & White Theme
const COLORS = {
  PRIMARY: 0x3498DB,      // Bright Blue
  SUCCESS: 0x2ECC71,      // Emerald Green (for success)
  ERROR: 0xE74C3C,        // Red (for errors)
  WARNING: 0xF39C12,      // Orange (for warnings)
  WHITE: 0xFFFFFF,        // White
  LIGHT_BLUE: 0x5DADE2    // Light Blue
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removedomain')
    .setDescription('Remove a custom domain (Admin only)')
    .addStringOption(option =>
      option.setName('domain')
        .setDescription('Domain to remove')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id;
    const domain = interaction.options.getString('domain');
    
    // Check if user is bot owner
    const ownerId = process.env.OWNER_ID;
    if (userId !== ownerId) {
      return await interaction.reply({
        content: t(userId, 'errors.permission', {}, guildId),
        ephemeral: true
      });
    }
    
    try {
      const apiKey = process.env.CATCHMAIL_API_KEY;
      const catchmail = new CatchMailAPI(apiKey);
      
      await catchmail.removeDomain(domain);
      
      const embed = new EmbedBuilder()
        .setColor(COLORS.WARNING)
        .setTitle('🗑️ Domain Removed')
        .setDescription(t(userId, 'admin.removedomain.success', { domain }, guildId))
        .setFooter({ text: 'The easiest way to handle email is with a Discord bot' })
        .setTimestamp();
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Error removing domain:', error);
      await interaction.reply({
        content: t(userId, 'admin.removedomain.error', {}, guildId),
        ephemeral: true
      });
    }
  }
};
