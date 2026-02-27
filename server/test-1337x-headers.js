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
            console.log(`Testing ${proxy} with advanced headers...`);
            const { data: html, status } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1'
                },
                httpsAgent,
                timeout: 10000
            });

            console.log(`[OK] Status: ${status}, HTML Length: ${html.length}`);
            if (html.toLowerCase().includes('cloudflare') || html.toLowerCase().includes('ray id') || html.toLowerCase().includes('just a moment')) {
                console.log('WARNING: Cloudflare detected.');
            } else {
                console.log('SUCCESS: No obvious Cloudflare block.');
                return; // Stop if we find a working one
            }
        } catch (e) {
            console.log(`[FAIL] ${e.message}`);
        }
    }
}

checkProxies();
