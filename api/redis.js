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
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });
    } catch (e) {
        console.warn('Redis package not available. Caching disabled.');
    }
}

// Fallback mock client if client is not initialized or not in Node
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
    try {
        if (client && client.connect && !client.isOpen) {
            await client.connect();
            console.log('Connected to Redis');
        }
    } catch (err) {
        console.warn('Could not connect to Redis. App will continue without caching.');
    }
};

module.exports = { client, connectRedis };
