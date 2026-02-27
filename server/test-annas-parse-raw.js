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

        // Test parsing - skip the first empty one, grab the second
        const items = $('a[href^="/md5/"]');
        if (items.length > 1) {
            const htmlStr = $(items[1]).html();
            console.log(htmlStr);
        }

    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

checkAnnasHTML();
