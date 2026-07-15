const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const express = require('express');
const router = express.Router();

const ZAI_BASE_URL = (isNode && process.env.ZAI_BASE_URL) || 'https://api.z.ai/api/paas/v4';

router.post('/ask', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required and must be an array' });
  }

  try {
    const payload = {
      model: (isNode && process.env.ZAI_MODEL) || 'z-1-proto',
      messages: messages,
      stream: false
    };

    if (!(isNode && process.env.ZAI_API_KEY)) {
      return res.status(500).json({ error: 'AI API Key not configured' });
    }

    const response = await fetch(`${ZAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${isNode && process.env.ZAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    res.json({
      message: data.choices[0].message.content,
      usage: data.usage
    });

  } catch (error) {
    console.error('Error in AskAI:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    configured: !!(isNode && process.env.ZAI_API_KEY),
    baseUrl: ZAI_BASE_URL
  });
});

module.exports = router;
