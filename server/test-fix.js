const { scrapeElAmigos, scrapeGamesTorrents } = require('./scrapers/games');

async function test() {
    console.log('=== Testing ElAmigos for "god of war" ===');
    try {
        const r1 = await scrapeElAmigos('god of war');
        console.log('Results:', r1.length);
        r1.slice(0, 5).forEach(r => console.log(' ', r.name, '|', r.link));
    } catch (e) { console.log('Error:', e.message); }

    console.log('\n=== Testing GamesTorrents for "god of war" ===');
    try {
        const r2 = await scrapeGamesTorrents('god of war');
        console.log('Results:', r2.length);
        r2.slice(0, 5).forEach(r => console.log(' ', r.name, '|', r.link));
    } catch (e) { console.log('Error:', e.message); }
}

test();
