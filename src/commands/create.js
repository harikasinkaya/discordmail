const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const CatchMailAPI = require('../utils/catchmail');
const EmailStore = require('../utils/store');
const { t, getSupportedLanguages, getLanguageName } = require('../languages');

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
    .setName('create')
    .setDescription('Create a temporary email address'),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id;
    
    try {
      // Initialize API and store
      const apiKey = process.env.CATCHMAIL_API_KEY;
      const catchmail = new CatchMailAPI(apiKey);
      
      // Get available domains
      let domains = [];
      try {
        domains = await catchmail.getDomains();
      } catch (error) {
        console.error('Failed to fetch domains:', error);
        // Fallback to default domains if API fails
        domains = ['tempmail.com', 'quickmail.io', 'catchmail.net'];
      }
      
      // Create select menu for domain selection
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('domain_select')
        .setPlaceholder('Select a domain for your temp email')
        .addOptions(
          domains.map((domain, index) => ({
            label: domain.length > 25 ? domain.substring(0, 22) + '...' : domain,
            value: domain,
            emoji: '📧',
            description: `Create email with ${domain}`
          })).slice(0, 25) // Discord allows max 25 options
        );
      
      const row = new ActionRowBuilder().addComponents(selectMenu);
      
      // Create embed response
      const { EmbedBuilder } = require('discord.js');
      const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle('📧 ' + t(userId, 'embeds.emailCreated.title', {}, guildId))
        .setDescription('**Select a domain below to create your temporary email address!**\n\n*The easiest way to handle email is with a Discord bot.*')
        .addFields(
          { name: 'ℹ️ How it works', value: 'Choose a domain from the dropdown menu and your unique temp email will be generated instantly!', inline: false },
          { name: '⏱️ Duration', value: 'Your email will be active for **10 minutes**', inline: true },
          { name: '🔒 Privacy', value: 'No registration required • Completely anonymous', inline: true }
        )
        .setFooter({ text: t(userId, 'embeds.welcome.footer', {}, guildId) })
        .setTimestamp();
      
      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Error creating email:', error);
      await interaction.reply({
        content: t(userId, 'errors.generic', {}, guildId),
        ephemeral: true
      });
    }
  }
};
