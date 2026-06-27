const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const express = isNode ? require('express') : null;
const cors = isNode ? require('cors') : null;

let path, fs;
if (isNode) {
    path = require('path');
    fs = require('fs');
    require('dotenv').config();
}

const mongoDB = isNode ? require('./db') : null;
const { connectRedis } = isNode ? require('./redis') : { connectRedis: () => {} };

const app = isNode ? express() : {
    use: () => {},
    get: () => {},
    post: () => {},
    put: () => {},
    delete: () => {},
    listen: () => {}
};
const port = (isNode && process.env.PORT) || 5000;

if (isNode) {
    // Middleware
    app.use(express.json());
    app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Serve static files from uploads directory with absolute path
    const uploadsPath = path.resolve(__dirname, 'uploads');
    if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
    }
    app.use('/uploads', express.static(uploadsPath));
    console.log(`Serving static files from: ${uploadsPath}`);
}

// Routes
app.use('/api', isNode ? require('./Routes/CreateUser') : (req, res, next) => next());
app.use('/api', isNode ? require('./Routes/DisplayData') : (req, res, next) => next());
app.use('/api', isNode ? require('./Routes/OrderData') : (req, res, next) => next());
app.use('/api', isNode ? require('./Routes/CartRoutes') : (req, res, next) => next());
app.use('/api', isNode ? require('./Routes/AdminAuth') : (req, res, next) => next());
app.use('/api', isNode ? require('./Routes/AdminRoutes') : (req, res, next) => next());
app.use('/api', isNode ? require('./Routes/AskAI') : (req, res, next) => next());
app.use('/api', isNode ? require('./Routes/PaymentRoutes') : (req, res, next) => next());
app.use('/api', isNode ? require('./Routes/ReelUserRoutes') : (req, res, next) => next());

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
        if (isNode && typeof process !== 'undefined' && process.exit) {
            process.exit(1);
        }
    });
}
