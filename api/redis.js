const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let redis;
let client;

if (isNode) {
    try {
        redis = require('redis');
        client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        client.on('error', (err) => {
            // Suppress repeated connection logs to avoid console noise when offline
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });
    } catch (err) {
        console.warn('Redis package not found, using mock fallback client.');
    }
}

if (!client) {
    client = {
        isOpen: false,
        connect: async () => {},
        get: async () => null,
        set: async () => {},
        del: async () => {},
        on: () => {}
    };
}

const connectRedis = async () => {
    try {
        if (client && !client.isOpen && typeof client.connect === 'function') {
            await client.connect();
            console.log('Connected to Redis');
        }
    } catch (err) {
        console.warn('Could not connect to Redis. App will continue without caching.');
    }
};

module.exports = { client, connectRedis };
