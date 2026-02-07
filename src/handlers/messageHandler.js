const bible = require('../services/bible');
const messenger = require('../services/messenger');

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
  Examples:
  • /search love
  • /search faith
  • /search hope

Powered by API.bible 🙏`;
}

module.exports = { handleMessage };
