const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoDB = require('./db');
const { connectRedis } = require('./redis');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Guard fs and static serving for non-Node environments
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    const uploadsPath = path.resolve(__dirname, 'uploads');
    if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
    }
    app.use('/uploads', express.static(uploadsPath));
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

// Initialization function for database and cache
app.init = async () => {
    await mongoDB();
    connectRedis();
};

// Auto-initialize if run directly
if (require.main === module) {
    const port = process.env.PORT || 5000;
    app.init().then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }).catch(err => {
        console.error("Failed to initialize app:", err);
        process.exit(1);
    });
}

module.exports = app;
