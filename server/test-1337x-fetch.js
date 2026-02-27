async function testFetch() {
    const urls = [
        'https://1337x.to/category-search/ubuntu/Apps/1/',
        'https://1337x.st/category-search/ubuntu/Apps/1/',
        'https://x1337x.ws/category-search/ubuntu/Apps/1/'
    ];

    for (const url of urls) {
        try {
            console.log(`Testing native fetch on ${url}...`);
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1'
                }
            });
            console.log(`[Status] ${res.status}`);
            const text = await res.text();
            if (res.status === 200) {
                console.log(`[Success] Retrieved HTML length: ${text.length}`);
            } else {
                console.log(`[Blocked] Content: ${text.substring(0, 50)}...`);
            }
        } catch (e) {
            console.log(`[Error] ${e.message}`);
        }
    }
}

testFetch();
