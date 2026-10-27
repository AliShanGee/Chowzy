const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client = { isOpen: false, del: async () => {}, on: () => {} };
let connectRedis = async () => {};

if (isNode) {
    const redis = require('redis');
    const nativeClient = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    nativeClient.on('error', (err) => {
        if (err.code !== 'ECONNREFUSED') {
            console.log('Redis Client Error', err);
        }
    });

    connectRedis = async () => {
        try {
            if (!nativeClient.isOpen) {
                await nativeClient.connect();
                console.log('Connected to Redis');
            }
        } catch (err) {
            console.warn('Could not connect to Redis. App will continue without caching.');
        }
    };

    client = nativeClient;
}

module.exports = { client, connectRedis };
