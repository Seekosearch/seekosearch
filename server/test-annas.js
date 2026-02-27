const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const PROXIES = [
    'https://annas-archive.li',
    'https://annas-archive.gl'
];

async function checkAnnasHTML() {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    for (const proxy of PROXIES) {
        const url = `${proxy}/search?q=mario`;
        try {
            console.log(`Testing ${url}...`);
            const { data: html } = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                httpsAgent,
                timeout: 15000
            });

            console.log(`[OK] HTML Length: ${html.length}`);
            const $ = cheerio.load(html);

            // Just check if we can see search results
            const results = $('a[href^="/md5/"]');
            console.log(`Found ${results.length} result links.`);
            if (results.length > 0) {
                console.log('Sample link:', results.first().attr('href'));
            }
            // Check for cloudflare or captcha
            if (html.toLowerCase().includes('cloudflare') || html.toLowerCase().includes('ray id')) {
                console.log('WARNING: Possible Cloudflare block detected.');
            }
            break;

        } catch (e) {
            console.log(`[FAIL] ${proxy}: ${e.message}`);
        }
    }
}

checkAnnasHTML();
