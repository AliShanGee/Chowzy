require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require('./db');
const cors = require('cors'); // Import the cors package

// Use the cors middleware to handle Cross-Origin Resource Sharing
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Ensure DB is connected before handling requests (for serverless)
app.use(async (req, res, next) => {
  try {
    await mongoDB();
    next();
  } catch (err) {
    console.error("DB connection middleware error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// API Routes
app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayData"));
app.use('/api', require("./Routes/OrderData"));
app.use('/api', require("./Routes/AdminRoutes"));
app.use('/api', require("./Routes/AskGemini"));
// Add other routes here as you create them

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Only start the server when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

// Export the app for Vercel serverless
module.exports = app;
