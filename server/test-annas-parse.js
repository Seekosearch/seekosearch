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

        let found = 0;
        // Test parsing
        $('a[href^="/md5/"]').each((i, el) => {
            const linkHref = $(el).attr('href');
            console.log(`\n--- Result ${i} ---`);
            console.log(`Link: ${linkHref}`);

            // Try broad text extraction
            const rawText = $(el).text().trim().replace(/\s+/g, ' ');
            console.log(`Raw Text: ${rawText.substring(0, 50)}...`);

            const titleNode = $(el).find('h3');
            console.log(`Title: ${titleNode.text()}`);

            found++;
            if (found >= 3) return false;
        });

    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

checkAnnasHTML();
