const redis = require('redis');
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

const client = isNode ? redis.createClient({
    url: (isNode && process.env.REDIS_URL) || 'redis://localhost:6379'
}) : {
    on: () => {},
    connect: async () => {},
    isOpen: false
};

client.on('error', (err) => {
    // Suppress repeated connection logs to avoid console noise when offline
    if (err.code !== 'ECONNREFUSED') {
        console.log('Redis Client Error', err);
    }
});

const connectRedis = async () => {
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
