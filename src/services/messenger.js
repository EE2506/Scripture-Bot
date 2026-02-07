const axios = require('axios');

const GRAPH_API = 'https://graph.facebook.com/v18.0';

/**
 * Send a text message to a Messenger user
 * @param {string} recipientId - The PSID of the recipient
 * @param {string} text - Message text to send
 */
async function sendMessage(recipientId, text) {
    try {
        // Split long messages (Messenger has 2000 char limit)
        const chunks = splitMessage(text, 1900);

        for (const chunk of chunks) {
            await axios.post(
                `${GRAPH_API}/me/messages`,
                {
                    recipient: { id: recipientId },
                    message: { text: chunk },
                    messaging_type: 'RESPONSE'
                },
                {
                    params: {
                        access_token: process.env.PAGE_ACCESS_TOKEN
                    }
                }
            );
        }

        return true;
    } catch (error) {
        console.error('Messenger Send Error:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Parse command from message text
 * @param {string} text - Raw message text
 * @returns {Object} - { command, args } or null if not a command
 */
function parseCommand(text) {
    const trimmed = text.trim();

    // Check for /bible command
    const bibleMatch = trimmed.match(/^\/bible\s+(.+)$/i);
    if (bibleMatch) {
        return { command: 'bible', args: bibleMatch[1].trim() };
    }

    // Check for /search command
    const searchMatch = trimmed.match(/^\/search\s+(.+)$/i);
    if (searchMatch) {
        return { command: 'search', args: searchMatch[1].trim() };
    }

    // Check for /help command
    if (trimmed.toLowerCase() === '/help') {
        return { command: 'help', args: '' };
    }

    return null;
}

/**
 * Split long messages into chunks
 */
function splitMessage(text, maxLength) {
    if (text.length <= maxLength) {
        return [text];
    }

    const chunks = [];
    let remaining = text;

    while (remaining.length > 0) {
        if (remaining.length <= maxLength) {
            chunks.push(remaining);
            break;
        }

        // Find a good break point (sentence or word boundary)
        let breakPoint = remaining.lastIndexOf('. ', maxLength);
        if (breakPoint === -1 || breakPoint < maxLength / 2) {
            breakPoint = remaining.lastIndexOf(' ', maxLength);
        }
        if (breakPoint === -1) {
            breakPoint = maxLength;
        }

        chunks.push(remaining.substring(0, breakPoint + 1).trim());
        remaining = remaining.substring(breakPoint + 1).trim();
    }

    return chunks;
}

module.exports = { sendMessage, parseCommand };
