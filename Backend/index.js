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

// Connect to DB first, then start server
mongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}).catch((err) => {
  console.error("Failed to connect to DB", err);
  process.exit(1);
});
