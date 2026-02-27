const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

async function checkHTML() {
    const url = 'https://thepibay.site/s/?q=ubuntu&page=0&orderby=99';
    try {
        const { data: html } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const $ = cheerio.load(html);
        const results = [];
        $('#searchResult tr').each((i, el) => {
            // skip header
            if ($(el).find('th').length > 0 || $(el).hasClass('header')) return;

            const name = $(el).find('.detName a').text().trim();
            if (!name) return;

            const link = $(el).find('a[href^="magnet:"]').attr('href') || '#';

            const desc = $(el).find('font.detDesc').text() || '';
            // "Uploaded 09-08 2024, Size 5.78 GiB, ULed by..."
            let size = 'Unknown';
            let date = 'Unknown';
            const sizeMatch = desc.match(/Size\s+([^,]+)/i);
            if (sizeMatch) size = sizeMatch[1].replace('&nbsp;', ' ');
            const dateMatch = desc.match(/Uploaded\s+([^,]+)/i);
            if (dateMatch) date = dateMatch[1].replace('&nbsp;', ' ');

            const tdsRight = $(el).find('td[align="right"]');
            const seeders = parseInt(tdsRight.eq(0).text()) || 0;
            const leechers = parseInt(tdsRight.eq(1).text()) || 0;

            results.push({ name, link, size, date, seeders, leechers });
        });

        console.log(`Found ${results.length} results`);
        console.log(results.slice(0, 3));
    } catch (e) {
        console.log('Error:', e.message);
    }
}

checkHTML();
