const proxy = (url) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);

const targets = {
    'Anna': 'https://annas-archive.li/search?q=ubuntu',
    'OpenLibrary': 'https://openlibrary.org/search.json?q=ubuntu',
    'ArchiveOrg': 'https://archive.org/advancedsearch.php?q=ubuntu&output=json',
    'FitGirl': 'https://fitgirl-repacks.site/?s=ubuntu',
    'ElAmigos': 'https://elamigos.site/?q=ubuntu',
    'GamesTorrents': 'https://www.gamestorrents.app/?s=ubuntu',
    'Skidrow': 'https://www.skidrowreloaded.com/?s=ubuntu&x=0&y=0'
};

const controller = new AbortController();
setTimeout(() => controller.abort(), 10000); // 10s timeout

async function testDomains() {
    const promises = Object.entries(targets).map(async ([name, target]) => {
        try {
            const res = await fetch(proxy(target), { signal: controller.signal });
            const text = await res.text();

            if (text.includes('Just a moment') || text.includes('Cloudflare') || res.status === 403) {
                return `[${name}] BLOCKED! ❌`;
            } else if (res.ok) {
                return `[${name}] SUCCESS! ✅ (Length: ${text.length})`;
            } else {
                return `[${name}] FAILED (${res.status}) ⚠️`;
            }
        } catch (e) {
            if (e.name === 'AbortError') return `[${name}] TIMEOUT ⏱️`;
            return `[${name}] Error: ${e.message}`;
        }
    });

    const results = await Promise.all(promises);
    results.forEach(r => console.log(r));
}

testDomains();
