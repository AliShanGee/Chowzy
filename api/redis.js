const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let redis;
let client;

if (isNode) {
    try {
        redis = require('redis');
        client = redis.createClient({
            url: (process.env && process.env.REDIS_URL) || 'redis://localhost:6379'
        });

        client.on('error', (err) => {
            // Suppress repeated connection logs to avoid console noise when offline
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });
    } catch (e) {
        console.warn('Redis module failed to load. Caching disabled.');
    }
}

const connectRedis = async () => {
    if (!client) return;
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
