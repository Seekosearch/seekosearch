const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://1337x.to/search/ubuntu/1/');

async function check() {
    const res = await fetch(url);
    const text = await res.text();
    console.log('1337x HTML length:', text.length);
    if (text.includes('table-list')) {
        console.log('Found table-list!');
    } else {
        console.log('No table-list found. First 500 chars:', text.slice(0, 500));
    }

    const nyaaUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://nyaa.si/?f=0&c=0_0&q=ubuntu');
    const resNyaa = await fetch(nyaaUrl);
    const textNyaa = await resNyaa.text();
    console.log('Nyaa HTML length:', textNyaa.length);
    if (textNyaa.includes('torrent-list')) {
        console.log('Found torrent-list!');
    } else {
        console.log('No torrent-list found. First 500 chars:', textNyaa.slice(0, 500));
    }
}

check();
