const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { t, getSupportedLanguages, getLanguageName, setUserLanguage } = require('../languages');

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
    .setName('language')
    .setDescription('Change the bot language')
    .addStringOption(option =>
      option.setName('lang')
        .setDescription('Language code (e.g., en, tr, es)')
        .setRequired(true)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'Türkçe', value: 'tr' },
          { name: 'Español', value: 'es' },
          { name: 'Français', value: 'fr' },
          { name: 'Deutsch', value: 'de' },
          { name: 'Italiano', value: 'it' },
          { name: 'Português', value: 'pt' },
          { name: 'Русский', value: 'ru' },
          { name: '日本語', value: 'ja' },
          { name: '中文', value: 'zh' },
          { name: '한국어', value: 'ko' },
          { name: 'العربية', value: 'ar' },
          { name: 'हिन्दी', value: 'hi' }
        )
    ),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id;
    const selectedLang = interaction.options.getString('lang');
    
    try {
      // Set user's language preference
      const success = setUserLanguage(userId, selectedLang);
      
      if (!success) {
        return await interaction.reply({
          content: t(userId, 'errors.generic', {}, guildId),
          ephemeral: true
        });
      }
      
      const langName = getLanguageName(selectedLang);
      
      const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle('🌐 Language Changed')
        .setDescription(t(userId, 'commands.language.changed', { lang: langName }, guildId))
        .setFooter({ text: 'The easiest way to handle email is with a Discord bot' })
        .setTimestamp();
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Error changing language:', error);
      await interaction.reply({
        content: t(userId, 'errors.generic', {}, guildId),
        ephemeral: true
      });
    }
  }
};
