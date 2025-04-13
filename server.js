const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/now-playing', async (req, res) => {
  try {
    const response = await fetch('https://zeno.fm/radio/TheBear1640/metadata');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
