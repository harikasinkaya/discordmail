const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EmailStore = require('../../utils/store');
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
    .setName('stats')
    .setDescription('View bot statistics (Admin only)'),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id;
    
    // Check if user is bot owner
    const ownerId = process.env.OWNER_ID;
    if (userId !== ownerId) {
      return await interaction.reply({
        content: t(userId, 'errors.permission', {}, guildId),
        ephemeral: true
      });
    }
    
    try {
      const store = new EmailStore();
      const stats = store.getStats();
      
      const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle('📊 Bot Statistics')
        .addFields(
          { name: t(userId, 'admin.stats.totalUsers', {}, guildId), value: `${stats.totalUsers}`, inline: true },
          { name: t(userId, 'admin.stats.activeEmails', {}, guildId), value: `${stats.activeEmails}`, inline: true },
          { name: t(userId, 'admin.stats.totalMessages', {}, guildId), value: `${stats.totalMessages}`, inline: true }
        )
        .setFooter({ text: 'The easiest way to handle email is with a Discord bot' })
        .setTimestamp();
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Error getting stats:', error);
      await interaction.reply({
        content: t(userId, 'errors.generic', {}, guildId),
        ephemeral: true
      });
    }
  }
};
