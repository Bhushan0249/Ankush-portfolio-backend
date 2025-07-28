const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Replace with your real OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'No question provided' });
    }
    console.log('Received question:', question);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }]
      })
    });

    // Log status and headers for debugging
    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response headers:', response.headers.raw());

    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      console.log('Non-JSON response from OpenAI:', text);
      return res.status(500).json({ error: text });
    }

    if (!response.ok) {
      console.log('OpenAI error:', data);
      return res.status(response.status).json({ error: data });
    }

    res.json(data);
  } catch (err) {
    console.log('Server error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT)); 