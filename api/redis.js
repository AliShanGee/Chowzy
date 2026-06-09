const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let client = {
    isOpen: false,
    on: () => {},
    connect: async () => {},
    get: async () => null,
    set: async () => {},
    del: async () => {}
};

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
        console.warn('Redis module not found or failed to initialize.');
    }
}

const connectRedis = async () => {
    if (isNode && client.connect) {
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
