const { Events } = require('discord.js');
const translations = require('../languages');
const CatchMailAPI = require('../utils/catchmail');
const EmailStore = require('../utils/store');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand() && !interaction.isStringSelectMenu()) return;

        // Dil ayarını al
        const guildId = interaction.guild?.id;
        const userId = interaction.user.id;
        
        try {
            // Select Menu (Dropdown) işleme
            if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'domain_select') {
                    const selectedDomain = interaction.values[0];
                    
                    // Loading mesajı
                    await interaction.deferUpdate();

                    try {
                        const apiKey = process.env.CATCHMAIL_API_KEY;
                        const api = new CatchMailAPI(apiKey);
                        
                        // Email oluştur
                        const emailData = await api.createEmail(selectedDomain);
                        const email = emailData.email || emailData.address;
                        
                        // Store'a kaydet
                        const store = new EmailStore();
                        store.setEmail(userId, email, 600); // 10 dakika
                        
                        const embed = {
                            color: 0x3498DB, // Mavi
                            title: "✅ Email Created!",
                            description: `**Email Address**: \`${email}\`\n\n*The easiest way to handle email is with a Discord bot.*`,
                            fields: [
                                { name: "⏱️ Expires in", value: "10 minutes", inline: true },
                                { name: "🔒 Status", value: "Active", inline: true }
                            ],
                            footer: { text: "CatchMail Bot • The easiest way to handle email is with a Discord bot.", icon_url: interaction.client.user.displayAvatarURL() },
                            timestamp: new Date().toISOString()
                        };

                        await interaction.followUp({ embeds: [embed], ephemeral: true });
                    } catch (error) {
                        console.error('Error creating email from menu:', error);
                        const errorEmbed = {
                            color: 0xE74C3C,
                            title: "❌ Error",
                            description: "Failed to create email. Please try again."
                        };
                        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                    }
                    return;
                }
            }

            // Slash komutları
            if (!interaction.isChatInputCommand()) return;

            const { commandName } = interaction;
            
            // Admin Komutu Kontrolü
            const ownerId = process.env.OWNER_ID;
            const isAdmin = interaction.user.id === ownerId;

            if (commandName === 'adddomain' || commandName === 'removedomain' || commandName === 'stats') {
                if (!isAdmin) {
                    return interaction.reply({ 
                        content: "🚫 You do not have permission to use this command.", 
                        ephemeral: true 
                    });
                }
            }

            // Komutları yükle
            const command = interaction.client.commands.get(commandName);
            if (!command) return;

            await command.execute(interaction);

        } catch (error) {
            console.error('Interaction Error:', error);
            // Hata durumunda kullanıcıya nazikçe bilgi ver
            if (!interaction.replied && !interaction.deferred) {
                const errorEmbed = {
                    color: 0xE74C3C,
                    title: "⚠️ Error",
                    description: "Something went wrong. Please try again."
                };
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(() => {});
            }
        }
    }
};
