const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CatchMailAPI = require('../utils/catchmail');
const EmailStore = require('../utils/store');
const { t } = require('../languages');

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
    .setName('delete')
    .setDescription('Delete your temporary email address'),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id;
    
    try {
      // Initialize API and store
      const apiKey = process.env.CATCHMAIL_API_KEY;
      const catchmail = new CatchMailAPI(apiKey);
      const store = new EmailStore();
      
      // Get user's email
      const emailData = store.getEmail(userId);
      if (!emailData) {
        return await interaction.reply({
          content: t(userId, 'commands.delete.noEmail', {}, guildId),
          ephemeral: true
        });
      }
      
      const email = emailData.email;
      
      // Delete from API
      try {
        await catchmail.deleteEmail(email);
      } catch (apiError) {
        console.error('API delete error:', apiError.message);
        // Continue with local deletion even if API fails
      }
      
      // Delete from store
      store.deleteEmail(userId);
      
      const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS)
        .setTitle('✅ Email Deleted')
        .setDescription(t(userId, 'commands.delete.success', {}, guildId))
        .setTimestamp();
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Error deleting email:', error);
      await interaction.reply({
        content: t(userId, 'errors.generic', {}, guildId),
        ephemeral: true
      });
    }
  }
};
