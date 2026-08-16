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
    .setName('inbox')
    .setDescription('Check your temporary email inbox'),
  
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
      
      // Fetch inbox messages
      const messages = await catchmail.getInbox(email);
      
      // Update stats
      if (messages.length > 0) {
        store.addMessages(messages.length);
      }
      
      // Create embed response
      const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle(t(userId, 'embeds.inboxView.title', {}, guildId))
        .setTimestamp();
      
      if (messages.length === 0) {
        embed.setDescription(t(userId, 'commands.inbox.noMessages', {}, guildId));
      } else {
        embed.setDescription(t(userId, 'commands.inbox.messages', { count: messages.length }, guildId));
        
        // Show last 5 messages
        const recentMessages = messages.slice(-5);
        for (const msg of recentMessages) {
          const sender = msg.from || msg.sender || 'Unknown';
          const subject = msg.subject || 'No Subject';
          const preview = msg.preview || msg.body?.substring(0, 100) || '';
          
          embed.addFields({
            name: `${subject}`,
            value: `**From:** ${sender}\n${preview}`,
            inline: false
          });
        }
      }
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Error checking inbox:', error);
      await interaction.reply({
        content: t(userId, 'errors.generic', {}, guildId),
        ephemeral: true
      });
    }
  }
};
