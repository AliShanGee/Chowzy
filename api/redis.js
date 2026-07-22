const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let client;
if (isNode) {
    const redis = require('redis');
    client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
} else {
    // Mock client for non-Node.js runtimes (like Cloudflare Workers)
    client = {
        isOpen: false,
        on: () => {},
        connect: async () => {},
        get: async () => null,
        set: async () => null,
        del: async () => null,
    };
}

if (isNode) {
    client.on('error', (err) => {
        // Suppress repeated connection logs to avoid console noise when offline
        if (err.code !== 'ECONNREFUSED') {
            console.log('Redis Client Error', err);
        }
    });
}

const connectRedis = async () => {
    try {
        if (!client.isOpen && isNode) {
            await client.connect();
            console.log('Connected to Redis');
        }
    } catch (err) {
        console.warn('Could not connect to Redis. App will continue without caching.');
    }
};

module.exports = { client, connectRedis };
