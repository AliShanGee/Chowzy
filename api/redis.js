const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client = {
    isOpen: false,
    on: () => {},
    connect: async () => {},
    get: async () => null,
    set: async () => null,
    del: async () => null
};

if (isNode) {
    try {
        const redis = require('redis');
        const redisClient = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        redisClient.on('error', (err) => {
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });
        client = redisClient;
    } catch (e) {
        console.warn('Redis module failed to initialize:', e.message);
    }
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
