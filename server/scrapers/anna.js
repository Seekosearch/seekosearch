import * as cheerio from 'cheerio';

export async function scrapeAnnasArchive(query) {
    try {
        const url = `https://annas-archive.li/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const results = [];

        $('a[href^="/md5/"]').each((i, el) => {
            if (i > 9) return;

            const link = `https://annas-archive.li${$(el).attr('href')}`;
            const blocks = $(el).find('div');

            let title = '';
            blocks.each((_, block) => {
                const t = $(block).text().trim();
                if (t.length > 5 && !title) title = t;
            });

            if (title) {
                results.push({
                    id: `anna-${i}-${Date.now()}`,
                    name: title,
                    link,
                    seeders: 0,
                    leechers: 0,
                    size: 'E-Book / PDF',
                    date: 'Unknown',
                    source: "Anna's Archive",
                });
            }
        });

        if (results.length === 0) {
            throw new Error("Cloudflare blocked the request or no results found");
        }

        return results;
    } catch (error) {
        console.error("Anna's Archive Scrape Error:", error.message);
        throw new Error("Anna's Archive scraping failed or blocked by Cloudflare");
    }
}
