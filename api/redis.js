const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client = {
    isOpen: false,
    connect: async () => {},
    get: async () => null,
    set: async () => {},
    del: async () => {},
    on: () => {}
};

let connectRedis = async () => {};

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

        connectRedis = async () => {
            try {
                if (!client.isOpen) {
                    await client.connect();
                    console.log('Connected to Redis');
                }
            } catch (err) {
                console.warn('Could not connect to Redis. App will continue without caching.');
            }
        };
    } catch (e) {
        // Fallback for non-Node runtime
    }
}

module.exports = { client, connectRedis };
