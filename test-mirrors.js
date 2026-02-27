const proxies = [
    { name: 'allorigins.win', url: (url) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url) }
];

const targets = [
    'https://1337x.to/search/ubuntu/1/',
    'https://1337x.st/search/ubuntu/1/',
    'https://x1337x.ws/search/ubuntu/1/',
    'https://x1337x.eu/search/ubuntu/1/',
    'https://x1337x.se/search/ubuntu/1/'
];

async function testMirrors() {
    for (const t of targets) {
        for (const p of proxies) {
            try {
                const res = await fetch(p.url(t));
                const text = await res.text();
                if (text.includes('table-list')) {
                    console.log('[' + p.name + '] ' + t + ' -> SUCCESS! Found table-list');
                } else if (text.includes('Just a moment')) {
                    console.log('[' + p.name + '] ' + t + ' -> Cloudflare Blocked');
                } else {
                    console.log('[' + p.name + '] ' + t + ' -> Failed/Unknown (Length: ' + text.length + ')');
                }
            } catch (e) {
                console.log('[' + p.name + '] ' + t + ' -> Fetch Error ' + e.message);
            }
        }
    }
}

testMirrors();
