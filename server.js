const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { Readable } = require('stream');

const app = express();
app.use(cors());

app.get('/now-playing', async (req, res) => {
  try {
    const response = await fetch('https://api.zeno.fm/mounts/metadata/subscribe/iicqk5crm0yvv');
    const reader = response.body.getReader();

    let streamData = '';
    const timeout = setTimeout(() => {
      res.status(504).json({ error: 'Timeout getting metadata' });
      reader.cancel();
    }, 3000); // 3 second timeout

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      streamData += new TextDecoder().decode(value);

      if (streamData.includes('streamTitle')) {
        const match = streamData.match(/data:(.*?)\n/);
        if (match && match[1]) {
          const json = JSON.parse(match[1]);
          clearTimeout(timeout);
          return res.json({
            title: json.streamTitle || '',
            artist: 'Now Playing',
          });
        }
      }
    }
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});

