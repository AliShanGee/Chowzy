require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require('./db');
const cors = require('cors');

// CORS configuration to allow Vercel frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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
  res.send('Hello World! Server is running.');
});

// Start server immediately to pass health checks
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});

// Connect to DB asynchronously
mongoDB().catch((err) => {
  console.error("Failed to connect to DB", err);
});
