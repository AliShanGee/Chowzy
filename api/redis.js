const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let client;

if (isNode) {
    try {
        const redis = require('redis');
        client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        client.on('error', (err) => {
            // Suppress repeated connection logs to avoid console noise when offline
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });
    } catch (e) {
        // Fallback to mock client below
    }
}

if (!client) {
    client = {
        on: () => {},
        connect: async () => {},
        isOpen: false,
        get: async () => null,
        set: async () => null,
        del: async () => null
    };
}

const connectRedis = async () => {
    if (isNode && typeof client.connect === 'function') {
        try {
            if (!client.isOpen) {
                await client.connect();
                console.log('Connected to Redis');
            }
        } catch (err) {
            console.warn('Could not connect to Redis. App will continue without caching.');
        }
    }
};

module.exports = { client, connectRedis };
