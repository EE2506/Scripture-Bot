const cron = require('node-cron');
const axios = require('axios');
const bible = require('./bible');

const GRAPH_API = 'https://graph.facebook.com/v18.0';

// Collection of inspirational daily verses
const dailyVerses = [
    'John 3:16',
    'Psalm 23:1',
    'Philippians 4:13',
    'Romans 8:28',
    'Jeremiah 29:11',
    'Proverbs 3:5',
    'Isaiah 41:10',
    'Matthew 11:28',
    'Psalm 46:1',
    'Romans 12:2',
    '2 Timothy 1:7',
    'Psalm 119:105',
    'Galatians 5:22',
    'Hebrews 11:1',
    '1 Corinthians 13:4',
    'Ephesians 2:8',
    'James 1:5',
    'Psalm 37:4',
    'Proverbs 16:3',
    'Matthew 6:33',
    'Joshua 1:9',
    'Psalm 91:1',
    '1 Peter 5:7',
    'Colossians 3:23',
    'Micah 6:8',
    'Psalm 27:1',
    'Romans 15:13',
    '2 Corinthians 5:17',
    'Psalm 139:14',
    'Matthew 5:16'
];

// Store subscriber IDs (in production, use a database)
let subscribers = new Set();

/**
 * Subscribe a user to daily verses
 */
function subscribe(senderId) {
    subscribers.add(senderId);
    console.log(`📬 Subscribed: ${senderId}. Total subscribers: ${subscribers.size}`);
    return true;
}

/**
 * Unsubscribe a user from daily verses
 */
function unsubscribe(senderId) {
    subscribers.delete(senderId);
    console.log(`📭 Unsubscribed: ${senderId}. Total subscribers: ${subscribers.size}`);
    return true;
}

/**
 * Check if user is subscribed
 */
function isSubscribed(senderId) {
    return subscribers.has(senderId);
}

/**
 * Get a random verse from the collection
 */
function getRandomVerseReference() {
    return dailyVerses[Math.floor(Math.random() * dailyVerses.length)];
}

/**
 * Send a message to a specific user
 */
async function sendMessageToUser(recipientId, text) {
    try {
        await axios.post(
            `${GRAPH_API}/me/messages`,
            {
                recipient: { id: recipientId },
                message: { text },
                messaging_type: 'MESSAGE_TAG',
                tag: 'CONFIRMED_EVENT_UPDATE' // For subscription-based messages
            },
            {
                params: { access_token: process.env.PAGE_ACCESS_TOKEN }
            }
        );
        return true;
    } catch (error) {
        console.error(`Failed to send to ${recipientId}:`, error.response?.data || error.message);
        return false;
    }
}

/**
 * Send daily verse to all subscribers
 */
async function sendDailyVerseToAll() {
    if (subscribers.size === 0) {
        console.log('📭 No subscribers for daily verse');
        return;
    }

    const verseRef = getRandomVerseReference();
    console.log(`📖 Sending daily verse: ${verseRef} to ${subscribers.size} subscriber(s)`);

    try {
        const verse = await bible.getVerse(verseRef);
        if (!verse) {
            console.error('Could not fetch verse');
            return;
        }

        const message = `🌅 Daily Verse\n\n📖 ${verse.reference}\n\n${verse.content}\n\n🙏 Have a blessed day!`;

        for (const subscriberId of subscribers) {
            await sendMessageToUser(subscriberId, message);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('✅ Daily verse sent successfully!');
    } catch (error) {
        console.error('Error sending daily verse:', error.message);
    }
}

/**
 * Initialize the scheduler
 * Timezone: Asia/Manila (UTC+8) - adjust if needed
 */
function initScheduler() {
    // 6:00 AM daily (Philippine Time = UTC+8)
    // Cron format: minute hour day month weekday
    // For UTC server: 6 AM PHT = 10 PM UTC previous day (22:00)
    cron.schedule('0 22 * * *', () => {
        console.log('⏰ 6 AM - Sending morning verse...');
        sendDailyVerseToAll();
    }, {
        timezone: 'Asia/Manila'
    });

    // 6:00 PM daily (Philippine Time)
    // 6 PM PHT = 10 AM UTC
    cron.schedule('0 10 * * *', () => {
        console.log('⏰ 6 PM - Sending evening verse...');
        sendDailyVerseToAll();
    }, {
        timezone: 'Asia/Manila'
    });

    console.log('📅 Daily verse scheduler initialized! (6 AM & 6 PM Philippine Time)');
}

module.exports = {
    subscribe,
    unsubscribe,
    isSubscribed,
    initScheduler,
    sendDailyVerseToAll,
    getSubscriberCount: () => subscribers.size
};
