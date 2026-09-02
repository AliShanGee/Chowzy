const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client = {
    isOpen: false,
    get: async () => null,
    set: async () => null,
    del: async () => null,
    on: () => {}
};

let connectRedis = async () => {};

if (isNode) {
    try {
        const redis = require('redis');
        const redisClient = redis.createClient({
            url: (typeof process !== 'undefined' && process.env && process.env.REDIS_URL) || 'redis://localhost:6379'
        });

        redisClient.on('error', (err) => {
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });

        client = redisClient;

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
        console.warn('Redis module loading skipped:', e.message);
    }
}

module.exports = { client, connectRedis };
