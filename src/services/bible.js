const axios = require('axios');

// Primary: API.bible (requires key)
const API_BIBLE_BASE = 'https://api.scripture.api.bible/v1';
const BIBLE_ID = 'de4e12af7f28f599-02'; // KJV

// Fallback: bible-api.com (no key required)
const FALLBACK_API = 'https://bible-api.com';

/**
 * Get a specific verse or chapter from the Bible
 * Tries API.bible first, falls back to bible-api.com
 */
async function getVerse(reference) {
    // Try fallback API first (more reliable, no key needed)
    try {
        const result = await getVerseFromFallback(reference);
        if (result) return result;
    } catch (err) {
        console.log('Fallback API failed, trying API.bible...');
    }

    // Try API.bible as backup
    if (process.env.API_BIBLE_KEY) {
        try {
            return await getVerseFromApiBible(reference);
        } catch (err) {
            console.error('API.bible also failed:', err.message);
        }
    }

    return null;
}

/**
 * Get verse from bible-api.com (no key required!)
 */
async function getVerseFromFallback(reference) {
    try {
        // bible-api.com uses format like "john 3:16" or "john+3:16"
        const encoded = encodeURIComponent(reference);
        const response = await axios.get(`${FALLBACK_API}/${encoded}`);

        const data = response.data;
        if (data.error) {
            throw new Error(data.error);
        }

        return {
            reference: data.reference,
            content: data.text.trim(),
            copyright: 'World English Bible (Public Domain)'
        };
    } catch (error) {
        console.error('Fallback API Error:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get verse from API.bible
 */
async function getVerseFromApiBible(reference) {
    const passageId = parseReference(reference);
    console.log(`Looking up passage: ${passageId}`);

    const response = await axios.get(
        `${API_BIBLE_BASE}/bibles/${BIBLE_ID}/passages/${passageId}`,
        {
            headers: {
                'api-key': process.env.API_BIBLE_KEY
            },
            params: {
                'content-type': 'text',
                'include-notes': false,
                'include-titles': true,
                'include-chapter-numbers': false,
                'include-verse-numbers': true
            }
        }
    );

    const data = response.data.data;
    return {
        reference: data.reference,
        content: cleanText(data.content),
        copyright: data.copyright
    };
}

/**
 * Search the Bible for a keyword
 */
async function searchBible(keyword) {
    // Try fallback first
    try {
        const encoded = encodeURIComponent(keyword);
        // bible-api.com doesn't have search, so we'll use a verse reference search
        // For now, just return a helpful message
        return [{
            reference: 'Search tip',
            text: `Try searching for specific verses like "John 3:16" or "love" won't work directly. Use /bible [reference] instead.`
        }];
    } catch (error) {
        console.error('Search Error:', error.message);
        return [];
    }
}

/**
 * Parse a human-readable reference to API format
 */
function parseReference(reference) {
    const bookMap = {
        'genesis': 'GEN', 'gen': 'GEN',
        'exodus': 'EXO', 'exo': 'EXO',
        'leviticus': 'LEV', 'lev': 'LEV',
        'numbers': 'NUM', 'num': 'NUM',
        'deuteronomy': 'DEU', 'deu': 'DEU', 'deut': 'DEU',
        'joshua': 'JOS', 'jos': 'JOS',
        'judges': 'JDG', 'jdg': 'JDG',
        'ruth': 'RUT', 'rut': 'RUT',
        '1 samuel': '1SA', '1samuel': '1SA', '1sa': '1SA',
        '2 samuel': '2SA', '2samuel': '2SA', '2sa': '2SA',
        '1 kings': '1KI', '1kings': '1KI', '1ki': '1KI',
        '2 kings': '2KI', '2kings': '2KI', '2ki': '2KI',
        '1 chronicles': '1CH', '1chronicles': '1CH', '1ch': '1CH',
        '2 chronicles': '2CH', '2chronicles': '2CH', '2ch': '2CH',
        'ezra': 'EZR', 'ezr': 'EZR',
        'nehemiah': 'NEH', 'neh': 'NEH',
        'esther': 'EST', 'est': 'EST',
        'job': 'JOB',
        'psalms': 'PSA', 'psalm': 'PSA', 'psa': 'PSA', 'ps': 'PSA',
        'proverbs': 'PRO', 'prov': 'PRO', 'pro': 'PRO',
        'ecclesiastes': 'ECC', 'ecc': 'ECC',
        'song of solomon': 'SNG', 'song': 'SNG', 'sng': 'SNG',
        'isaiah': 'ISA', 'isa': 'ISA',
        'jeremiah': 'JER', 'jer': 'JER',
        'lamentations': 'LAM', 'lam': 'LAM',
        'ezekiel': 'EZK', 'ezk': 'EZK', 'eze': 'EZK',
        'daniel': 'DAN', 'dan': 'DAN',
        'hosea': 'HOS', 'hos': 'HOS',
        'joel': 'JOL', 'jol': 'JOL',
        'amos': 'AMO', 'amo': 'AMO',
        'obadiah': 'OBA', 'oba': 'OBA',
        'jonah': 'JON', 'jon': 'JON',
        'micah': 'MIC', 'mic': 'MIC',
        'nahum': 'NAM', 'nam': 'NAM',
        'habakkuk': 'HAB', 'hab': 'HAB',
        'zephaniah': 'ZEP', 'zep': 'ZEP',
        'haggai': 'HAG', 'hag': 'HAG',
        'zechariah': 'ZEC', 'zec': 'ZEC',
        'malachi': 'MAL', 'mal': 'MAL',
        'matthew': 'MAT', 'matt': 'MAT', 'mat': 'MAT',
        'mark': 'MRK', 'mrk': 'MRK',
        'luke': 'LUK', 'luk': 'LUK',
        'john': 'JHN', 'jhn': 'JHN',
        'acts': 'ACT', 'act': 'ACT',
        'romans': 'ROM', 'rom': 'ROM',
        '1 corinthians': '1CO', '1corinthians': '1CO', '1co': '1CO',
        '2 corinthians': '2CO', '2corinthians': '2CO', '2co': '2CO',
        'galatians': 'GAL', 'gal': 'GAL',
        'ephesians': 'EPH', 'eph': 'EPH',
        'philippians': 'PHP', 'php': 'PHP', 'phil': 'PHP',
        'colossians': 'COL', 'col': 'COL',
        '1 thessalonians': '1TH', '1thessalonians': '1TH', '1th': '1TH',
        '2 thessalonians': '2TH', '2thessalonians': '2TH', '2th': '2TH',
        '1 timothy': '1TI', '1timothy': '1TI', '1ti': '1TI',
        '2 timothy': '2TI', '2timothy': '2TI', '2ti': '2TI',
        'titus': 'TIT', 'tit': 'TIT',
        'philemon': 'PHM', 'phm': 'PHM',
        'hebrews': 'HEB', 'heb': 'HEB',
        'james': 'JAS', 'jas': 'JAS',
        '1 peter': '1PE', '1peter': '1PE', '1pe': '1PE',
        '2 peter': '2PE', '2peter': '2PE', '2pe': '2PE',
        '1 john': '1JN', '1john': '1JN', '1jn': '1JN',
        '2 john': '2JN', '2john': '2JN', '2jn': '2JN',
        '3 john': '3JN', '3john': '3JN', '3jn': '3JN',
        'jude': 'JUD', 'jud': 'JUD',
        'revelation': 'REV', 'rev': 'REV'
    };

    const normalized = reference.toLowerCase().trim();
    const match = normalized.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);

    if (!match) {
        throw new Error('Invalid reference format. Try: John 3:16 or Psalm 23');
    }

    const [, bookName, chapter, verseStart, verseEnd] = match;
    const bookCode = bookMap[bookName.toLowerCase()];

    if (!bookCode) {
        throw new Error(`Unknown book: ${bookName}`);
    }

    if (verseEnd) {
        return `${bookCode}.${chapter}.${verseStart}-${bookCode}.${chapter}.${verseEnd}`;
    } else if (verseStart) {
        return `${bookCode}.${chapter}.${verseStart}`;
    } else {
        return `${bookCode}.${chapter}`;
    }
}

/**
 * Clean HTML/formatting from text
 */
function cleanText(text) {
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

module.exports = { getVerse, searchBible };
