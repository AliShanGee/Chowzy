const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
let redis;
if (isNode) {
    redis = require('redis');
}

const client = isNode ? redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
}) : null;

client.on('error', (err) => {
    // Suppress repeated connection logs to avoid console noise when offline
    if (err.code !== 'ECONNREFUSED') {
        console.log('Redis Client Error', err);
    }
});

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
