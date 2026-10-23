const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client;

if (isNode) {
    try {
        const redis = require('redis');
        client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        client.on('error', (err) => {
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });
    } catch (e) {
        console.warn('Failed to load redis module');
    }
}

if (!client) {
    client = {
        isOpen: false,
        connect: async () => {},
        get: async () => null,
        set: async () => null,
        del: async () => null,
        on: () => {}
    };
}

const connectRedis = async () => {
    if (!isNode) return;
    try {
        if (!client.isOpen && typeof client.connect === 'function') {
            await client.connect();
            console.log('Connected to Redis');
        }
    } catch (err) {
        console.warn('Could not connect to Redis. App will continue without caching.');
    }
};

module.exports = { client, connectRedis };
