import * as cheerio from 'cheerio';

export async function scrapeOpenLibrary(query) {
    try {
        const targetUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`OpenLibrary HTTP error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.docs) return [];

        const docs = data.docs.slice(0, 100);

        return docs.map((book, index) => {
            const link = book.key ? `https://openlibrary.org${book.key}` : '#';
            const year = book.first_publish_year || 'Unknown';

            return {
                id: `openlib-${book.key || index}-${Date.now()}`,
                name: `${book.title} ${book.author_name ? 'by ' + book.author_name[0] : ''}`,
                link,
                seeders: 0,
                leechers: 0,
                size: 'E-Book',
                date: year.toString(),
                source: 'OpenLibrary',
            };
        });
    } catch (error) {
        console.error('OpenLibrary Scrape Error:', error.message);
        throw new Error('OpenLibrary API failed');
    }
}

export async function scrapeArchiveOrg(query) {
    try {
        const targetUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&output=json&rows=100`;
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Archive.org HTTP error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.response || !data.response.docs) return [];

        return data.response.docs.map((doc, index) => {
            const identifier = doc.identifier;
            const link = identifier ? `https://archive.org/details/${identifier}` : '#';

            return {
                id: `archiveorg-${identifier || index}-${Date.now()}`,
                name: doc.title || doc.identifier,
                link,
                seeders: doc.downloads || 0,
                leechers: 0,
                size: doc.mediatype || 'Media',
                date: doc.date ? doc.date.substring(0, 10) : 'Unknown',
                source: 'Archive.org',
            };
        });
    } catch (error) {
        console.error('Archive.org Scrape Error:', error.message);
        throw new Error('Archive.org API failed');
    }
}

const ANNAS_PROXIES = [
    'https://annas-archive.li',
    'https://annas-archive.gl'
];

export async function scrapeAnnasArchive(query) {
    let lastError = null;

    for (const proxy of ANNAS_PROXIES) {
        try {
            const url = `${proxy}/search?q=${encodeURIComponent(query)}`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                signal: AbortSignal.timeout(15000),
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);
            const results = [];

            $('a[href^="/md5/"]').each((i, el) => {
                if (results.length >= 45) return false;

                const linkHref = $(el).attr('href');
                if (!linkHref) return;

                const rawText = $(el).text().trim().replace(/\s+/g, ' ');
                if (rawText.length < 5) return;

                const link = `${proxy}${linkHref}`;
                const name = rawText;
                const size = 'E-Book';

                if (!results.some(r => r.link === link)) {
                    results.push({
                        id: `annas-${i}-${Date.now()}`,
                        name,
                        link,
                        seeders: 0,
                        leechers: 0,
                        size,
                        date: 'Unknown',
                        source: 'Anna\'s Archive',
                    });
                }
            });

            if (results.length > 0) {
                return results;
            } else {
                console.warn(`AnnasArchive Scraper: 0 results from ${proxy}`);
            }

        } catch (error) {
            console.warn(`AnnasArchive Scraper: Proxy ${proxy} failed (${error.message}). Trying next...`);
            lastError = error;
        }
    }

    console.error('AnnasArchive Error: All proxies failed. Last error:', lastError?.message);
    throw new Error('Anna\'s Archive scraping failed');
}
