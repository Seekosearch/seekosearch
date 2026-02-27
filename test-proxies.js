const proxies = [
  { name: 'corsproxy.io', url: (url) => 'https://corsproxy.io/?' + encodeURIComponent(url) },
  { name: 'allorigins.win', url: (url) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url) },
  { name: 'corsproxy.org', url: (url) => 'https://corsproxy.org/?' + encodeURIComponent(url) }
];

const target1337x = 'https://1337x.to/search/ubuntu/1/';
const targetNyaa = 'https://nyaa.si/?f=0&c=0_0&q=ubuntu';

async function testProxies() {
  console.log('Testing 1337x...');
  for (const p of proxies) {
    try {
      const res = await fetch(p.url(target1337x));
      console.log('[' + p.name + '] 1337x: ' + res.status + ' ' + res.statusText);
    } catch (e) {
      console.log('[' + p.name + '] 1337x: Error ' + e.message);
    }
  }

  console.log('\\nTesting Nyaa...');
  for (const p of proxies) {
    try {
      const res = await fetch(p.url(targetNyaa));
      console.log('[' + p.name + '] Nyaa: ' + res.status + ' ' + res.statusText);
    } catch (e) {
      console.log('[' + p.name + '] Nyaa: Error ' + e.message);
    }
  }
}

testProxies();
