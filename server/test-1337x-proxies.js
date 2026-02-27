const axios = require('axios');
const https = require('https');

const PROXIES = [
    'https://1337x.to',
    'https://1337x.st',
    'https://x1337x.cc',
    'https://x1337x.ws',
    'https://x1337x.eu'
];

async function checkProxies() {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    for (const proxy of PROXIES) {
        const url = `${proxy}/category-search/ubuntu/Apps/1/`;
        try {
            console.log(`Testing ${proxy}...`);
            const { data: html, status } = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                httpsAgent,
                timeout: 10000
            });

            console.log(`[OK] Status: ${status}, HTML Length: ${html.length}`);
            if (html.toLowerCase().includes('cloudflare') || html.toLowerCase().includes('ray id')) {
                console.log('WARNING: Cloudflare detected.');
            }
        } catch (e) {
            console.log(`[FAIL] ${e.message}`);
        }
    }
}

checkProxies();
