const axios = require('axios');

async function testPagination() {
    const urls = [
        'https://fitgirl-repacks.site/page/2/?s=god+of+war',
        'https://www.gamestorrents.app/page/2/?s=god+of+war',
        'https://www.skidrowreloaded.com/page/2/?s=god+of+war&x=0&y=0'
    ];

    for (const url of urls) {
        try {
            const { status } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 });
            console.log(`[OK] ${url} -> ${status}`);
        } catch (e) {
            console.log(`[FAIL] ${url} -> ${e.response?.status || e.message}`);
        }
    }
}
testPagination();
