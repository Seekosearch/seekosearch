const { scrapeTPB } = require('./scrapers/tpb');

async function test() {
    console.log('=== Testing TPB for "ubuntu" ===');
    try {
        const r = await scrapeTPB('ubuntu');
        console.log(`Results: ${r.length}`);
        if (r.length > 0) {
            console.log(r.slice(0, 3).map(x => `${x.name} - ${x.size} - S:${x.seeders}`));
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
}

test();
