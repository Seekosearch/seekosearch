import * as cheerio from 'cheerio';

export async function scrape1337x(query) {
    try {
        const targetUrl = `https://1337x.to/search/${encodeURIComponent(query)}/1/`;
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
            signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const results = [];

        $('table.table-list tbody tr').each((i, el) => {
            const nameCol = $(el).find('td.coll-1.name');
            const titleAnchor = nameCol.find('a').eq(1);
            const name = titleAnchor.text().trim() || nameCol.text().trim();

            const linkHref = titleAnchor.attr('href');
            const link = linkHref ? `https://1337x.to${linkHref}` : '#';

            const seeders = parseInt($(el).find('td.coll-2.seeds').text().trim()) || 0;
            const leechers = parseInt($(el).find('td.coll-3.leeches').text().trim()) || 0;
            const date = $(el).find('td.coll-date').text().trim() || 'Unknown';

            const sizeCol = $(el).find('td.coll-4.size');
            sizeCol.find('span').remove();
            const size = sizeCol.text().trim() || 'Unknown';

            results.push({
                id: `1337x-${i}-${Date.now()}`,
                name,
                link,
                seeders,
                leechers,
                size,
                date,
                source: '1337x',
            });
        });

        return results;
    } catch (error) {
        console.error('1337x Scrape Error:', error.message);
        throw new Error('1337x scraping failed or blocked');
    }
}
