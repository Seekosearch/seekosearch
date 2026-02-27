import * as cheerio from 'cheerio';

const MAX_PAGES = 5;

function parseNyaaPage($) {
    const results = [];
    $('table.torrent-list tr').each((i, e) => {
        if (i === 0) return;

        const tds = $(e).find('td');
        if (tds.length < 5) return;

        const nameCol = tds.eq(1);
        const titleAnchor = nameCol.find('a:not(.comments)').first();
        const name = titleAnchor.attr('title') || titleAnchor.text().trim();

        if (!name) return;

        const linksCol = tds.eq(2);
        const magnetLink = linksCol.find('a[href^="magnet:"]').attr('href') || '#';

        const size = tds.eq(3).text().trim() || 'Unknown';
        const date = tds.eq(4).text().trim() || 'Unknown';
        const seeders = parseInt(tds.eq(5).text().trim()) || 0;
        const leechers = parseInt(tds.eq(6).text().trim()) || 0;

        results.push({ name, link: magnetLink, seeders, leechers, size, date });
    });
    return results;
}

const NYAA_MIRRORS = [
    'https://nyaa.si',
    'https://nyaa.land',
    'https://nyaa.ink',
];

export async function scrapeNyaa(query) {
    let lastError = null;

    for (const mirror of NYAA_MIRRORS) {
        try {
            const allResults = [];

            for (let page = 1; page <= MAX_PAGES; page++) {
                const targetUrl = `${mirror}/?f=0&c=0_0&q=${encodeURIComponent(query)}&p=${page}`;

                const response = await fetch(targetUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                    }
                });

                if (!response.ok) {
                    if (page === 1) {
                        console.warn(`Nyaa mirror ${mirror} failed with status ${response.status}. Trying next...`);
                        lastError = new Error(`HTTP ${response.status}`);
                        break;
                    }
                    break;
                }

                const html = await response.text();

                // Check if we got a valid Nyaa page (not a block/captcha page)
                if (!html.includes('torrent-list') && page === 1) {
                    console.warn(`Nyaa mirror ${mirror} returned unexpected HTML. Trying next...`);
                    lastError = new Error('Unexpected HTML');
                    break;
                }

                const $ = cheerio.load(html);
                const pageResults = parseNyaaPage($);

                if (pageResults.length === 0) {
                    if (page === 1) {
                        // First page empty might mean mirror is broken
                        break;
                    }
                    break;
                }

                allResults.push(...pageResults);

                const hasNextPage = $('ul.pagination li:last-child').hasClass('disabled') === false;
                if (!hasNextPage) break;
            }

            if (allResults.length > 0) {
                return allResults.map((r, i) => ({
                    id: `nyaa-${i}-${Date.now()}`,
                    ...r,
                    source: 'Nyaa',
                }));
            }
        } catch (error) {
            console.warn(`Nyaa mirror ${mirror} error: ${error.message}. Trying next...`);
            lastError = error;
        }
    }

    // If all mirrors failed but didn't throw, return empty
    if (lastError) {
        console.error('Nyaa Scrape Error: All mirrors failed. Last error:', lastError.message);
        // throw new Error('Nyaa scraping failed across all mirrors');
    }
    return [];
}
