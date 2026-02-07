const axios = require('axios');
const bible = require('./bible');

const GRAPH_API = 'https://graph.facebook.com/v18.0';

/**
 * Get the Page ID from the access token
 */
async function getPageId() {
    try {
        const response = await axios.get(`${GRAPH_API}/me`, {
            params: { access_token: process.env.PAGE_ACCESS_TOKEN }
        });
        return response.data.id;
    } catch (error) {
        console.error('Failed to get Page ID:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Post a verse to the Facebook Page Feed
 */
async function postVerseToPage() {
    try {
        // Get a random verse or a specific one
        // For variety, we could fetch from API.bible random endpoint if available, but let's use our daily list for reliability first
        // actually, let's use the random feature from daily verses logic, but maybe we need a bigger list?
        // Let's use the bible-api.com random endpoint if possible? 
        // bible-api.com doesn't have a reliable "random" endpoint without knowing references.
        // Let's use our internal list for now to ensure quality.

        // Wait, the user wants "using the Api". 
        // Let's try to get a random verse from API.bible if possible, but it requires knowing book/chapter.

        // Let's use the scheduler's random verse logic but exposed here?
        // Better: let's import the random verse logic or move it to bible.js?
        // For now, let's just duplicate the list or import it if we export it from scheduler.

        // Let's assume we maintain a list here or fetch from a service.
        // I will use a hardcoded list for now, similar to scheduler.

        const verses = [
            'John 3:16', 'Psalm 23:1', 'Philippians 4:13', 'Romans 8:28', 'Jeremiah 29:11',
            'Proverbs 3:5', 'Isaiah 41:10', 'Matthew 11:28', 'Psalm 46:1', 'Romans 12:2',
            '2 Timothy 1:7', 'Psalm 119:105', 'Galatians 5:22', 'Hebrews 11:1', '1 Corinthians 13:4'
        ];

        const verseRef = verses[Math.floor(Math.random() * verses.length)];
        const verse = await bible.getVerse(verseRef);

        if (!verse) {
            console.error('Could not fetch verse for page post');
            return false;
        }

        const message = `📖 ${verse.reference}\n\n${verse.content}\n\n#DailyVerse #ScriptureBot #Bible`;

        // Get Page ID if not cached (can be cached in variable)
        const pageId = await getPageId();
        if (!pageId) return false;

        const response = await axios.post(
            `${GRAPH_API}/${pageId}/feed`,
            {
                message: message,
                access_token: process.env.PAGE_ACCESS_TOKEN
            }
        );

        console.log(`✅ Posted to Page: ${response.data.id}`);
        return true;

    } catch (error) {
        console.error('Page Post Error:', error.response?.data || error.message);
        return false;
    }
}

module.exports = { postVerseToPage };
