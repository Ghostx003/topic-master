const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function test() {
  const urls = [
    'https://gateoverflow.in/1457/gate-cse-1999-question-1-3',
    'https://gateoverflow.in/866/gate-cse-2002-question-13',
    'https://gateoverflow.in/371891/gate-cse-2022-set-1-question-28',
    'https://gateoverflow.in/397368/gate-cse-2024-set-1-question-45'
  ];

  for (const url of urls) {
    try {
      const html = await fetchUrl(url);
      console.log('--- URL:', url);
      
      // Extract QA tags: <a href="..." class="qa-tag-link">...</a>
      const tags = [];
      const tagRegex = /class="qa-tag-link"[^>]*>([^<]+)<\/a>/g;
      let m;
      while ((m = tagRegex.exec(html)) !== null) {
        tags.push(m[1]);
      }
      console.log('Tags:', tags);

      // Check for marks in tags or text
      const marksTag = tags.find(t => /^\d+-mark|marks?$/i.test(t) || /marks?/i.test(t));
      const typeTag = tags.find(t => /^(mcq|msq|nat|numerical|fill-in-the-blanks?|descriptive)$/i.test(t));
      console.log('Detected from tags -> Marks:', marksTag, 'Type:', typeTag);
    } catch (e) {
      console.error('Error fetching', url, e.message);
    }
  }
}

test();
