const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoDB = require('./db');
const { connectRedis } = require('./redis');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Guard filesystem operations for Cloudflare Workers compatibility
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
if (isNode) {
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

// Initialization method for async startup
app.init = async () => {
    await mongoDB();
    await connectRedis();
};

// Only start server if run directly in Node
if (require.main === module) {
    app.init().then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }).catch(err => {
        console.error("Failed to initialize app:", err);
        process.exit(1);
    });
}

// Export app for Cloudflare Workers (Chowzy)
module.exports = app;
