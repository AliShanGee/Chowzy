const express = require('express');
const cors = require('cors');
const mongoDB = require('./db');

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
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

// Serve static files from uploads directory with absolute path
if (isNode) {
    const path = require('path');
    const fs = require('fs');
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
mongoDB().then(() => {
    connectRedis(); // Connect to Redis in background
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    if (isNode && process.exit) {
        process.exit(1);
    }
});
