const express = require('express');
const cors = require('cors');
const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

const path = isNode ? require('path') : null;
const fs = isNode ? require('fs') : null;
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

// Serve static files from uploads directory with absolute path
if (isNode && path && fs) {
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

// Connect to MongoDB and Redis then start server
if (isNode) {
    mongoDB().then(() => {
        connectRedis(); // Connect to Redis in background
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }).catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });
}

module.exports = app;
