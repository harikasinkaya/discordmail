const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load all commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');

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
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
      }
    }
  }
}

loadCommands(commandsPath);

// Deploy commands
async function deployCommands() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  
  if (!token || !clientId) {
    console.error('❌ DISCORD_TOKEN or CLIENT_ID not found in .env file!');
    process.exit(1);
  }
  
  const rest = new REST({ version: '10' }).setToken(token);
  
  try {
    console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);
    
    // For global deployment
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
    
    console.log(`✅ Successfully reloaded ${data.length} application (/) commands globally.`);
    
    // Uncomment below for guild-specific deployment (faster for testing)
    // const guildId = process.env.GUILD_ID;
    // if (guildId) {
    //   const guildData = await rest.put(
    //     Routes.applicationGuildCommands(clientId, guildId),
    //     { body: commands }
    //   );
    //   console.log(`✅ Successfully reloaded ${guildData.length} application (/) commands in guild ${guildId}.`);
    // }
    
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
}

deployCommands();
