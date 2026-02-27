import { JSDOM } from 'jsdom';

const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://nyaa.si/?f=0&c=0_0&q=ubuntu');

async function testNyaa() {
    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const rows = doc.querySelectorAll('table.torrent-list tr');
    console.log('Nyaa rows found:', rows.length);

    rows.forEach((row, index) => {
        const nameCol = row.querySelectorAll('td')[1];
        if (!nameCol) return;

        const titleAnchor = nameCol.querySelector('a:not(.comments)');
        const name = titleAnchor?.getAttribute('title') || titleAnchor?.textContent?.trim();

        if (!name) return;

        const linksCol = row.querySelectorAll('td')[2];
        const magnetLink = linksCol?.querySelector('a[href^="magnet:"]')?.getAttribute('href') || '#';
        const size = row.querySelectorAll('td')[3]?.textContent?.trim() || 'Unknown';
        const dateStr = row.querySelectorAll('td')[4]?.textContent?.trim() || 'Unknown';
        const seedersText = row.querySelectorAll('td')[5]?.textContent || '0';
        const leechersText = row.querySelectorAll('td')[6]?.textContent || '0';

        if (index < 3) {
            console.log('Result:', { name, magnetLink: magnetLink.substring(0, 20), size, seedersText });
        }
    });
}

testNyaa();
