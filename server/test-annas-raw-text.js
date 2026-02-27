const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

async function checkAnnasHTML() {
    const proxy = 'https://annas-archive.gl';
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const url = `${proxy}/search?q=mario`;
    try {
        const { data: html } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            httpsAgent,
            timeout: 15000
        });

        const $ = cheerio.load(html);

        // The link /md5/... wraps the entire row.
        const items = $('a[href^="/md5/"]');
        let parsed = 0;

        items.each((i, el) => {
            const rawText = $(el).text().trim().replace(/\s+/g, ' ');
            if (rawText.length < 10) return; // Skip image-only thumbnail wraps

            console.log(`\nFound Element ${parsed}:`);

            // Text format is usually:
            // "Title Author(s) Format, Size, ISBNs, etc..."
            // We can split it or just use the raw text as the name since they don't use strict tags for title vs author
            console.log(`Href: ${$(el).attr('href')}`);
            console.log(`Text: ${rawText}`);

            parsed++;
            if (parsed >= 5) return false;
        });

    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

checkAnnasHTML();
