const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let redis;
let client = null;

if (isNode) {
    try {
        redis = require('redis');
        client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        client.on('error', (err) => {
            // Suppress repeated connection logs to avoid console noise when offline
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });
    } catch (err) {
        console.warn('Redis module not found or failed to initialize.');
    }
}

const connectRedis = async () => {
    if (!isNode || !client) return;
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
