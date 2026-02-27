import * as cheerio from 'cheerio';

const PROXIES = [
    'https://thepiratebay0.org',
    'https://tpb.party',
    'https://piratebay.live',
    'https://thehiddenbay.com',
    'https://thepiratebay.zone',
    'https://tpbproxypirate.com'
];

const MAX_PAGES = 5;

export async function scrapeTPB(query) {
    let lastError = null;

    for (const proxy of PROXIES) {
        try {
            const allResults = [];
            let proxyFailed = false;

            for (let page = 0; page < MAX_PAGES; page++) {
                const url = `${proxy}/s/?q=${encodeURIComponent(query)}&page=${page}&orderby=99`;

                let html = '';
                try {
                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    html = await response.text();
                } catch (err) {
                    if (page === 0) {
                        console.warn(`TPB Scraper: Proxy ${proxy} failed on page 0 (${err.message}). Trying next proxy...`);
                        lastError = err;
                        proxyFailed = true;
                    }
                    break;
                }

                if (html.includes('No hits. Try adding an asterisk') || html.includes('No hits')) {
                    if (page === 0) {
                        return [];
                    }
                    break;
                }

                const $ = cheerio.load(html);
                const rows = $('#searchResult tr');

                if (rows.length === 0) {
                    if (page === 0) {
                        console.warn(`TPB Scraper: Unexpected HTML from ${proxy}, trying next...`);
                        proxyFailed = true;
                        break;
                    } else {
                        break;
                    }
                }

                let pageResultsAdded = 0;
                rows.each((i, el) => {
                    if ($(el).find('th').length > 0 || $(el).hasClass('header')) return;

                    const name = $(el).find('.detName a').text().trim();
                    if (!name) return;

                    const link = $(el).find('a[href^="magnet:"]').attr('href') || '#';

                    const desc = $(el).find('font.detDesc').text() || '';
                    let size = 'Unknown';
                    let date = 'Unknown';
                    const sizeMatch = desc.match(/Size\s+([^,]+)/i);
                    if (sizeMatch) size = sizeMatch[1].replace('&nbsp;', ' ');
                    const dateMatch = desc.match(/Uploaded\s+([^,]+)/i);
                    if (dateMatch) date = dateMatch[1].replace('&nbsp;', ' ');

                    const tdsRight = $(el).find('td[align="right"]');
                    const seeders = parseInt(tdsRight.eq(0).text()) || 0;
                    const leechers = parseInt(tdsRight.eq(1).text()) || 0;

                    allResults.push({
                        name,
                        link,
                        size,
                        date,
                        seeders,
                        leechers,
                    });
                    pageResultsAdded++;
                });

                if (pageResultsAdded === 0) {
                    break;
                }
            }

            if (proxyFailed) {
                continue;
            }

            if (allResults.length > 0) {
                return allResults.map((r, i) => ({
                    id: `tpb-${i}-${Date.now()}`,
                    ...r,
                    source: 'The Pirate Bay',
                }));
            } else {
                console.warn(`TPB Scraper: Parsed 0 results total from ${proxy}, trying next...`);
            }
        } catch (error) {
            console.warn(`TPB Scraper: Proxy loop outer error on ${proxy}: (${error.message}).`);
            lastError = error;
        }
    }

    console.error('TPB Scrape Error: All proxies failed. Last error:', lastError?.message);
    throw new Error('The Pirate Bay scraping failed across all proxies');
}
