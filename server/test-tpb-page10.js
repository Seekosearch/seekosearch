const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

async function checkPage10() {
    const url = 'https://thepibay.site/s/?q=mario&page=10&orderby=99';
    try {
        const { data: html } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        console.log('HTML Length:', html.length);
        const $ = cheerio.load(html);
        const rows = $('#searchResult tr');
        console.log('Rows found:', rows.length);

        console.log('Has "No hits" text?', html.includes('No hits'));
    } catch (e) {
        console.log('Error:', e.message);
    }
}

checkPage10();
