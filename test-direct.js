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
setTimeout(() => controller.abort(), 15000); // 15s timeout

async function testDomainsDirectly() {
    const promises = Object.entries(targets).map(async ([name, target]) => {
        try {
            const res = await fetch(target, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                }
            });
            const text = await res.text();

            if (text.includes('Just a moment') || text.includes('Cloudflare') || res.status === 403 || res.status === 503) {
                return `[${name}] BLOCKED by protection! ❌ (Status: ${res.status})`;
            } else if (res.ok) {
                return `[${name}] SUCCESS! ✅ (Status: 200, Length: ${text.length})`;
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

testDomainsDirectly();
