// Sample bot commands for your Telegram bot
const botCommands = [
    {
        command: 'start',
        description: 'Start the bingo game'
    },
    {
        command: 'play',
        description: 'Play quick bingo'
    },
    {
        command: 'stats',
        description: 'View your statistics'
    },
    {
        command: 'help',
        description: 'Get help with the game'
    }
];

// Web App configuration
const webAppConfig = {
    url: 'https://your-miniapp-url.onrender.com',
    name: 'Telegram Bingo',
    description: 'Play real-time bingo with friends'
};

module.exports = { botCommands, webAppConfig };