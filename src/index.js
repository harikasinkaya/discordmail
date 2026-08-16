const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { t, getLanguageName } = require('./languages');
const EmailStore = require('./utils/store');

// CatchMail Bot Colors - Blue & White Theme
const COLORS = {
  PRIMARY: 0x3498DB,      // Bright Blue
  SUCCESS: 0x2ECC71,      // Emerald Green (for success)
  ERROR: 0xE74C3C,        // Red (for errors)
  WARNING: 0xF39C12,      // Orange (for warnings)
  WHITE: 0xFFFFFF,        // White
  LIGHT_BLUE: 0x5DADE2    // Light Blue
};

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Command collection
client.commands = new Collection();

// Load commands
function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      loadCommands(filePath);
    } else if (file.endsWith('.js')) {
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
      }
    }
  }
}

// Load all commands
const commandsPath = path.join(__dirname, 'commands');
loadCommands(commandsPath);

// Initialize email store and start cleanup
const emailStore = new EmailStore();
emailStore.startCleanup(60000); // Cleanup every minute

// Ready event
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  console.log(`📊 Serving ${client.guilds.cache.size} servers`);
});

// Interaction handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  
  if (!command) {
    console.error(`❌ No command matching ${interaction.commandName} was found.`);
    return;
  }
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('❌ Error executing command:', error);
    
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id;
    
    const errorMessage = {
      content: t(userId, 'errors.generic', {}, guildId),
      ephemeral: true
    };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Guild join event - send welcome message
client.on('guildCreate', async guild => {
  console.log(`✅ Joined guild: ${guild.name}`);
  
  // Find a channel to send welcome message
  const channel = guild.channels.cache.find(
    c => c.type === 0 && c.permissionsFor(guild.members.me).has('SendMessages')
  );
  
  if (channel) {
    const embed = new EmbedBuilder()
      .setColor(COLORS.PRIMARY)
      .setTitle('🎉 CatchMail Bot is here!')
      .setDescription('Create temporary email addresses and receive messages directly in Discord!\n\nUse `/create` to get started.')
      .addFields(
        { name: '📧 Commands', value: '`/create` - Create temp email\n`/inbox` - Check messages\n`/delete` - Delete email\n`/language` - Change language' },
        { name: '🔧 Admin Commands', value: '`/adddomain` - Add custom domain\n`/removedomain` - Remove domain\n`/stats` - View statistics' }
      )
      .setFooter({ text: 'Made with ❤️ | The easiest way to handle email is with a Discord bot' })
      .setTimestamp();
    
    try {
      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to send welcome message:', error);
    }
  }
});

// Error handling
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Login
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN not found in .env file!');
  process.exit(1);
}

client.login(token);
