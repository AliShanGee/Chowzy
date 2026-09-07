const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client;
let connectRedis;

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
        client = { isOpen: false, get: async () => null, set: async () => null };
        connectRedis = async () => {};
    }
} else {
    client = { isOpen: false, get: async () => null, set: async () => null };
    connectRedis = async () => {};
}

module.exports = { client, connectRedis };
