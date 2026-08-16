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
    .setName('adddomain')
    .setDescription('Add a custom domain (Admin only)')
    .addStringOption(option =>
      option.setName('domain')
        .setDescription('Domain to add (e.g., example.com)')
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
      
      await catchmail.addDomain(domain);
      
      const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS)
        .setTitle('✅ Domain Added')
        .setDescription(t(userId, 'admin.adddomain.success', { domain }, guildId))
        .setFooter({ text: 'The easiest way to handle email is with a Discord bot' })
        .setTimestamp();
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Error adding domain:', error);
      await interaction.reply({
        content: t(userId, 'admin.adddomain.error', {}, guildId),
        ephemeral: true
      });
    }
  }
};
