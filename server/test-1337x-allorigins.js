const axios = require('axios');

async function testAllOrigins() {
    const targetUrl = 'https://1337x.to/category-search/ubuntu/Apps/1/';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        console.log('Testing allorigins proxy...');
        const { data } = await axios.get(proxyUrl, { timeout: 15000 });

        if (data.contents) {
            console.log(`[OK] Retrieved HTML via allorigins. Length: ${data.contents.length}`);
            if (data.contents.includes('1337x')) {
                console.log('SUCCESS: Valid HTML content found.');

                // Let's test the second proxy just in case
                const targetUrl2 = 'https://x1337x.eu/category-search/ubuntu/Apps/1/';
                const proxyUrl2 = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl2)}`;
                const res2 = await axios.get(proxyUrl2);
                console.log(`[OK] Second proxy x1337x.eu also works via allorigins. Length: ${res2.data.contents.length}`);
            }
        }
    } catch (e) {
        console.log(`[FAIL] ${e.message}`);
    }
}

testAllOrigins();
