const bible = require('../services/bible');
const messenger = require('../services/messenger');
const scheduler = require('../services/scheduler');

/**
 * Handle incoming Messenger messages
 */
async function handleMessage(event) {
    const senderId = event.sender.id;
    const messageText = event.message.text;

    console.log(`📩 Message from ${senderId}: ${messageText}`);

    // Parse the command
    const parsed = messenger.parseCommand(messageText);

    if (!parsed) {
        // Not a command, ignore or send help
        return;
    }

    let response;

    switch (parsed.command) {
        case 'bible':
            response = await handleBibleCommand(parsed.args);
            break;

        case 'search':
            response = await handleSearchCommand(parsed.args);
            break;

        case 'post':
            response = await handlePostCommand(senderId, parsed.args);
            break;

        case 'subscribe':
            response = await handleSubscribe(senderId, parsed.args);
            break;

        case 'unsubscribe':
            response = handleUnsubscribe(senderId);
            break;

        case 'help':
            response = getHelpMessage();
            break;

        default:
            response = '❓ Unknown command. Type /help for available commands.';
    }

    await messenger.sendMessage(senderId, response);
}

/**
 * Handle /bible [reference] command
 */
async function handleBibleCommand(reference) {
    try {
        const result = await bible.getVerse(reference);

        if (!result) {
            return `❌ Could not find "${reference}". Try: /bible John 3:16`;
        }

        return `📖 ${result.reference}\n\n${result.content}`;
    } catch (error) {
        return `❌ ${error.message}`;
    }
}

/**
 * Handle /search [keyword] command
 */
async function handleSearchCommand(keyword) {
    const results = await bible.searchBible(keyword);

    if (results.length === 0) {
        return `🔍 No results found for "${keyword}"`;
    }

    let response = `🔍 Search results for "${keyword}":\n\n`;

    for (const verse of results) {
        response += `📖 ${verse.reference}\n${verse.text}\n\n`;
    }

    return response.trim();
}

/**
 * Handle /post command (Admin only - for testing)
 */
async function handlePostCommand(senderId, args) {
    if (args && args.toLowerCase() === 'test') {
        // Trigger manual page post
        const result = await scheduler.postVerseToPage();
        if (result) {
            return '✅ Successfully posted a verse to the Page Feed!';
        } else {
            return '❌ Failed to post to Page. Check logs/permissions.';
        }
    }
    return 'Usage: /post test';
}

/**
 * Handle /subscribe command
 */
async function handleSubscribe(senderId, args) {
    // Check for test command
    if (args && args.toLowerCase() === 'test') {
        const success = await scheduler.sendDailyVerseToUser(senderId);
        if (success) {
            return '✅ Test successful! Sent a daily verse to your inbox.';
        } else {
            return '❌ Test failed. Could not fetch verse.';
        }
    }

    if (scheduler.isSubscribed(senderId)) {
        return `✅ You're already subscribed to daily verses!\n\n🌅 You'll receive verses at 6 AM & 6 PM.\n\nType /unsubscribe to stop.`;
    }

    scheduler.subscribe(senderId);

    // Send immediate welcome verse
    setTimeout(async () => {
        try {
            const verse = await bible.getVerse('Jeremiah 29:11');
            const msg = `🎉 Welcome! Here is your first daily verse:\n\n📖 ${verse.reference}\n\n${verse.content}`;
            await messenger.sendMessage(senderId, msg);
        } catch (e) {
            console.error('Error sending welcome verse:', e);
        }
    }, 1000);

    return `🙏 Subscribed to Daily Verses!\n\nYou will receive inspirational Bible verses:\n• 🌅 6:00 AM - Morning verse\n• 🌙 6:00 PM - Evening verse\n\nType /unsubscribe to stop anytime.`;
}

/**
 * Handle /unsubscribe command
 */
function handleUnsubscribe(senderId) {
    if (!scheduler.isSubscribed(senderId)) {
        return `📭 You're not subscribed to daily verses.\n\nType /subscribe to start receiving them!`;
    }

    scheduler.unsubscribe(senderId);
    return `📭 Unsubscribed from daily verses.\n\nYou won't receive automated verses anymore.\n\nType /subscribe to re-subscribe anytime!`;
}

/**
 * Get help message
 */
function getHelpMessage() {
    return `📖 ScriptureBot Commands:

/bible [reference]
  Get a specific verse or chapter
  Examples:
  • /bible John 3:16
  • /bible Psalm 23
  • /bible Romans 8:28-30

/search [keyword]
  Search for verses containing a word

/subscribe
  🌅 Get daily verses at 6 AM & 6 PM

/unsubscribe
  Stop receiving daily verses

🙏 Powered by ScriptureBot`;
}

module.exports = { handleMessage };
