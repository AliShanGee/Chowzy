const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client;
if (isNode) {
    const redis = require('redis');
    client = redis.createClient({
        url: (process.env && process.env.REDIS_URL) || 'redis://localhost:6379'
    });
    client.on('error', (err) => {
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
        on: () => {}
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
