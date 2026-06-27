const express = require('express');
const cors = require('cors');
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let path, fs;
if (isNode) {
    path = require('path');
    fs = require('fs');
    require('dotenv').config();
}

const mongoDB = require('./db');
const { connectRedis } = require('./redis');

const app = express();
const port = (isNode && process.env.PORT) || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

if (isNode) {
    // Serve static files from uploads directory with absolute path
    const uploadsPath = path.resolve(__dirname, 'uploads');
    if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
    }
    app.use('/uploads', express.static(uploadsPath));
    console.log(`Serving static files from: ${uploadsPath}`);
}

// Routes
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));
app.use('/api', require('./Routes/CartRoutes'));
app.use('/api', require('./Routes/AdminAuth'));
app.use('/api', require('./Routes/AdminRoutes'));
app.use('/api', require('./Routes/AskAI'));
app.use('/api', require('./Routes/PaymentRoutes'));
app.use('/api', require('./Routes/ReelUserRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// For Cloudflare Workers / Serverless
module.exports = app;

// Connect to MongoDB and Redis then start server
if (isNode && require.main === module) {
    mongoDB().then(() => {
        connectRedis(); // Connect to Redis in background
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }).catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        if (typeof process !== 'undefined' && process.exit) {
            process.exit(1);
        }
    });
}
