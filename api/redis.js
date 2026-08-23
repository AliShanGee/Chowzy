const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client = {
    on: () => {},
    connect: async () => {},
    isOpen: false,
    get: async () => null,
    set: async () => {},
    del: async () => {}
};

let connectRedis = async () => {};

if (isNode) {
    try {
        const redis = require('redis');
        client = redis.createClient({
            url: (process.env && process.env.REDIS_URL) || 'redis://localhost:6379'
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
    } catch (err) {
        // Fallback if redis module fails to load
    }
}

module.exports = { client, connectRedis };
