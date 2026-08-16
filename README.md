# CatchMail Discord Bot

A multi-language Discord bot that provides temporary email services using the CatchMail API.

## Features

- 🌍 **Multi-language Support**: 12+ languages including English, Turkish, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Chinese, Korean, Arabic, and Hindi
- 📧 **Temporary Email Creation**: Generate disposable email addresses instantly
- 📥 **Inbox Checking**: View received messages directly in Discord
- 🔧 **Admin Commands**: Custom domain management and statistics
- 💬 **Embed Responses**: Beautiful formatted messages
- ⏱️ **Auto-cleanup**: Automatic expiration of temporary emails

## Setup

### Prerequisites

- Node.js 16.9.0 or higher
- A Discord Bot Token
- CatchMail API Key (if required)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd catchmail-discord-bot
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here
CATCHMAIL_API_KEY=your_catchmail_api_key_here
OWNER_ID=your_discord_user_id_here
```

4. Deploy slash commands
```bash
node src/deploy-commands.js
```

5. Start the bot
```bash
# Production
npm start

# Development with auto-reload
npm run dev
```

## Commands

### User Commands

- `/create [domain]` - Create a temporary email address
- `/inbox` - Check your temporary email inbox
- `/delete` - Delete your temporary email address
- `/language <lang>` - Change the bot language

### Admin Commands (Owner Only)

- `/adddomain <domain>` - Add a custom domain
- `/removedomain <domain>` - Remove a custom domain
- `/stats` - View bot statistics

## Supported Languages

| Code | Language |
|------|----------|
| en   | English  |
| tr   | Türkçe   |
| es   | Español  |
| fr   | Français |
| de   | Deutsch  |
| it   | Italiano |
| pt   | Português|
| ru   | Русский  |
| ja   | 日本語    |
| zh   | 中文     |
| ko   | 한국어    |
| ar   | العربية  |
| hi   | हिन्दी    |

## Project Structure

```
catchmail-discord-bot/
├── src/
│   ├── commands/
│   │   ├── admin/
│   │   │   ├── adddomain.js
│   │   │   ├── removedomain.js
│   │   │   └── stats.js
│   │   ├── create.js
│   │   ├── delete.js
│   │   ├── inbox.js
│   │   └── language.js
│   ├── languages/
│   │   ├── index.js
│   │   └── translations.json
│   ├── utils/
│   │   ├── catchmail.js
│   │   └── store.js
│   ├── deploy-commands.js
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

## Adding New Languages

To add a new language:

1. Open `src/languages/translations.json`
2. Add a new language code section with all required translations
3. Update the language choices in `src/commands/language.js`
4. Add the language name to the `getLanguageName` function in `src/languages/index.js`

## Database Integration

Currently, the bot uses in-memory storage. For production use, replace the `EmailStore` class in `src/utils/store.js` with a database solution like:

- MongoDB
- PostgreSQL
- Redis
- SQLite

## License

ISC

## Support

For issues and feature requests, please open an issue on GitHub.
