const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client;
if (isNode) {
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
} else {
    client = {
        isOpen: false,
        get: async () => null,
        set: async () => null,
        del: async () => null,
    };
}

const connectRedis = async () => {
    if (!isNode) return;
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('Connected to Redis');
        }
    } catch (err) {
        console.warn('Could not connect to Redis. App will continue without caching.');
    }
};

module.exports = { client, connectRedis };
