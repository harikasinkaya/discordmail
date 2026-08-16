const i18next = require('i18next');
const translations = require('./translations.json');

// Supported languages
const supportedLanguages = Object.keys(translations);

// Initialize i18next
i18next.init({
  fallbackLng: 'en',
  resources: translations,
  interpolation: {
    escapeValue: false
  }
});

// User language preferences storage (in-memory for now, can be replaced with database)
const userLanguagePreferences = new Map();
const guildLanguagePreferences = new Map();

/**
 * Get the language code for a user
 * @param {string} userId - Discord user ID
 * @param {string} guildId - Discord guild ID (optional)
 * @returns {string} Language code
 */
function getUserLanguage(userId, guildId = null) {
  // Check user-specific preference first
  if (userLanguagePreferences.has(userId)) {
    return userLanguagePreferences.get(userId);
  }
  
  // Check guild preference if provided
  if (guildId && guildLanguagePreferences.has(guildId)) {
    return guildLanguagePreferences.get(guildId);
  }
  
  // Return fallback language
  return 'en';
}

/**
 * Set user's language preference
 * @param {string} userId - Discord user ID
 * @param {string} language - Language code
 */
function setUserLanguage(userId, language) {
  if (supportedLanguages.includes(language)) {
    userLanguagePreferences.set(userId, language);
    return true;
  }
  return false;
}

/**
 * Set guild's language preference
 * @param {string} guildId - Discord guild ID
 * @param {string} language - Language code
 */
function setGuildLanguage(guildId, language) {
  if (supportedLanguages.includes(language)) {
    guildLanguagePreferences.set(guildId, language);
    return true;
  }
  return false;
}

/**
 * Translate a key for a specific user
 * @param {string} userId - Discord user ID
 * @param {string} key - Translation key (e.g., 'commands.create.response')
 * @param {object} params - Parameters for interpolation
 * @param {string} guildId - Discord guild ID (optional)
 * @returns {string} Translated string
 */
function t(userId, key, params = {}, guildId = null) {
  const lng = getUserLanguage(userId, guildId);
  return i18next.t(key, { ...params, lng });
}

/**
 * Get all supported languages
 * @returns {string[]} Array of language codes
 */
function getSupportedLanguages() {
  return supportedLanguages;
}

/**
 * Get language name from code
 * @param {string} code - Language code
 * @returns {string} Language name
 */
function getLanguageName(code) {
  const names = {
    'en': 'English',
    'tr': 'Türkçe',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'pt': 'Português',
    'ru': 'Русский',
    'ja': '日本語',
    'zh': '中文',
    'ko': '한국어',
    'ar': 'العربية',
    'hi': 'हिन्दी'
  };
  return names[code] || code;
}

module.exports = {
  t,
  getUserLanguage,
  setUserLanguage,
  getGuildLanguage: (guildId) => guildLanguagePreferences.get(guildId),
  setGuildLanguage,
  getSupportedLanguages,
  getLanguageName,
  i18next
};
