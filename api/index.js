const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const port = (isNode && process.env.PORT) || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Node-specific initialization and static serving
if (isNode) {
    const mongoDB = require('./db');
    const { connectRedis } = require('./redis');

    const uploadsPath = path.resolve(__dirname, 'uploads');
    if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
    }
    app.use('/uploads', express.static(uploadsPath));
    console.log(`Serving static files from: ${uploadsPath}`);

    app.init = async () => {
        await mongoDB();
        await connectRedis();
    };

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
} else {
    // Mock init for non-node environments
    app.init = async () => {};
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

module.exports = app;
