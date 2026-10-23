const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

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
        // Fallback mock client if redis module is unavailable or in non-Node environments
        client = {
            isOpen: false,
            get: async () => null,
            set: async () => null,
            del: async () => null,
            connect: async () => {}
        };
    }
} else {
    client = {
        isOpen: false,
        get: async () => null,
        set: async () => null,
        del: async () => null,
        connect: async () => {}
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
