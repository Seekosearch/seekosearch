import * as cheerio from 'cheerio';

const MAX_PAGES = 5;

export async function scrapeFitGirl(query) {
    try {
        const results = [];
        for (let page = 1; page <= MAX_PAGES; page++) {
            const url = page === 1
                ? `https://fitgirl-repacks.site/?s=${encodeURIComponent(query)}`
                : `https://fitgirl-repacks.site/page/${page}/?s=${encodeURIComponent(query)}`;

            try {
                const response = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    signal: AbortSignal.timeout(10000),
                });

                if (!response.ok) {
                    if (response.status === 404) break;
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const html = await response.text();
                const $ = cheerio.load(html);

                let pageResultsAdded = 0;
                $('article').each((i, e) => {
                    const titleAnchor = $(e).find('h1.entry-title a');
                    const name = titleAnchor.text().trim();
                    const link = titleAnchor.attr('href') || '#';
                    const date = $(e).find('time.entry-date').text().trim() || 'Unknown';

                    if (name) {
                        results.push({
                            id: `fitgirl-${page}-${i}-${Date.now()}`,
                            name,
                            link,
                            seeders: 0,
                            leechers: 0,
                            size: 'Repack',
                            date,
                            source: 'FitGirl',
                        });
                        pageResultsAdded++;
                    }
                });

                if (pageResultsAdded === 0 || !$('a.next.page-numbers').length) {
                    break;
                }
            } catch (err) {
                console.warn(`FitGirl page ${page} failed:`, err.message);
                break;
            }
        }
        return results;
    } catch (error) {
        console.error('FitGirl error:', error.message);
        throw new Error('FitGirl scraping failed');
    }
}

export async function scrapeElAmigos(query) {
    try {
        const url = 'https://elamigos.site/';
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const results = [];
        const queryLower = query.toLowerCase();

        $('h3, h5').each((i, e) => {
            const text = $(e).text().trim();
            if (text.toLowerCase().includes(queryLower)) {
                const anchor = $(e).find('a').first();
                const name = text.replace(/DOWNLOAD/gi, '').trim();
                let link = anchor.attr('href') || '#';
                if (link !== '#' && !link.startsWith('http')) {
                    link = `https://elamigos.site/${link}`;
                }

                if (name.length > 3) {
                    results.push({
                        id: `elamigos-${i}-${Date.now()}`,
                        name,
                        link,
                        seeders: 0,
                        leechers: 0,
                        size: 'ISO',
                        date: 'Unknown',
                        source: 'ElAmigos',
                    });
                }
            }
        });
        return results;
    } catch (error) {
        console.error('ElAmigos error:', error.message);
        throw new Error('ElAmigos scraping failed');
    }
}

export async function scrapeGamesTorrents(query) {
    try {
        const results = [];
        for (let page = 1; page <= MAX_PAGES; page++) {
            const url = page === 1
                ? `https://www.gamestorrents.app/?s=${encodeURIComponent(query)}`
                : `https://www.gamestorrents.app/page/${page}/?s=${encodeURIComponent(query)}`;

            try {
                const response = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    signal: AbortSignal.timeout(10000),
                });

                if (!response.ok) {
                    if (response.status === 404) break;
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const html = await response.text();
                const $ = cheerio.load(html);

                let pageResultsAdded = 0;
                $('table td a').each((i, e) => {
                    const name = $(e).text().trim();
                    const link = $(e).attr('href') || '#';

                    if (name.length > 3 && link.includes('/juegos-') && !link.includes('category_name') && !results.some(r => r.link === link)) {
                        results.push({
                            id: `gmtorrents-${page}-${i}-${Date.now()}`,
                            name,
                            link,
                            seeders: 0,
                            leechers: 0,
                            size: 'Torrent',
                            date: 'Unknown',
                            source: 'GamesTorrents',
                        });
                        pageResultsAdded++;
                    }
                });

                if (pageResultsAdded === 0 || !$('a.next.page-numbers').length) {
                    break;
                }
            } catch (err) {
                console.warn(`GamesTorrents page ${page} failed:`, err.message);
                break;
            }
        }
        return results;
    } catch (error) {
        console.error('GamesTorrents error:', error.message);
        throw new Error('GamesTorrents scraping failed');
    }
}

export async function scrapeSkidrow(query) {
    try {
        const results = [];
        for (let page = 1; page <= MAX_PAGES; page++) {
            const url = page === 1
                ? `https://www.skidrowreloaded.com/?s=${encodeURIComponent(query)}&x=0&y=0`
                : `https://www.skidrowreloaded.com/page/${page}/?s=${encodeURIComponent(query)}&x=0&y=0`;

            try {
                const response = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    signal: AbortSignal.timeout(10000),
                });

                if (!response.ok) {
                    if (response.status === 404) break;
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const html = await response.text();
                const $ = cheerio.load(html);

                let pageResultsAdded = 0;
                $('div.post').each((i, e) => {
                    const titleAnchor = $(e).find('h2 a');
                    const name = titleAnchor.text().trim();
                    const link = titleAnchor.attr('href') || '#';
                    const date = $(e).find('.date').text().trim() || 'Unknown';

                    if (name) {
                        results.push({
                            id: `skidrow-${page}-${i}-${Date.now()}`,
                            name,
                            link,
                            seeders: 0,
                            leechers: 0,
                            size: 'Release',
                            date,
                            source: 'SkidrowReloaded',
                        });
                        pageResultsAdded++;
                    }
                });

                if (pageResultsAdded === 0 || !$('.pagination a').text().includes('Older')) {
                    break;
                }
            } catch (err) {
                console.warn(`Skidrow page ${page} failed:`, err.message);
                break;
            }
        }
        return results;
    } catch (error) {
        console.error('Skidrow error:', error.message);
        throw new Error('SkidrowReloaded scraping failed');
    }
}
