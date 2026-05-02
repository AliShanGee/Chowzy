
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
require('dotenv').config();

// Initialize the Google Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    res.json({ response: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

module.exports = router;
