const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    // Test ElAmigos
    console.log('=== ELAMIGOS ===');
    try {
        const { data: html } = await axios.get('https://elamigos.site/?q=god+of+war', { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(html);

        // Find all anchors containing 'god'
        console.log('Links with "god":');
        $('a').each((i, e) => {
            const t = $(e).text().trim();
            const h = $(e).attr('href') || '';
            if (t.toLowerCase().includes('god') && t.length > 3) {
                console.log('  TEXT:', t.substring(0, 100));
                console.log('  HREF:', h.substring(0, 100));
                console.log('  PARENT TAG:', $(e).parent().prop('tagName'), 'CLASS:', $(e).parent().attr('class'));
                console.log('  ---');
            }
        });

        // Check common structures
        console.log('\nH3 tags:');
        $('h3').slice(0, 5).each((i, e) => {
            console.log('  H3:', $(e).text().trim().substring(0, 120));
            console.log('  Inner HTML:', $(e).html().substring(0, 200));
        });

        console.log('\nH5 tags:');
        $('h5').slice(0, 5).each((i, e) => {
            console.log('  H5:', $(e).text().trim().substring(0, 120));
        });
    } catch (err) {
        console.log('ElAmigos Error:', err.message);
    }

    // Test GamesTorrents
    console.log('\n=== GAMESTORRENTS ===');
    try {
        const { data: html } = await axios.get('https://www.gamestorrents.app/?s=god+of+war', { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(html);

        console.log('Links with "god":');
        $('a').each((i, e) => {
            const t = $(e).text().trim();
            const h = $(e).attr('href') || '';
            if (t.toLowerCase().includes('god') && t.length > 3) {
                console.log('  TEXT:', t.substring(0, 120));
                console.log('  HREF:', h.substring(0, 120));
                console.log('  PARENT TAG:', $(e).parent().prop('tagName'), 'CLASS:', $(e).parent().attr('class'));
                console.log('  ---');
            }
        });

        // Check common WordPress search structures
        console.log('\narticle tags:');
        $('article').slice(0, 3).each((i, e) => {
            console.log('  ARTICLE CLASS:', $(e).attr('class')?.substring(0, 80));
            console.log('  TEXT:', $(e).text().trim().substring(0, 150));
        });

        console.log('\nh2 tags with links:');
        $('h2 a, h3 a').slice(0, 5).each((i, e) => {
            console.log('  TEXT:', $(e).text().trim().substring(0, 100));
            console.log('  HREF:', $(e).attr('href'));
        });

        console.log('\ndiv.blomark, div.juego:');
        $('div.blomark, div.juego, div.bloque-juego').slice(0, 3).each((i, e) => {
            console.log('  TAG:', $(e).prop('tagName'), 'CLASS:', $(e).attr('class'));
            console.log('  TEXT:', $(e).text().trim().substring(0, 120));
        });
    } catch (err) {
        console.log('GamesTorrents Error:', err.message);
    }
}

test();
