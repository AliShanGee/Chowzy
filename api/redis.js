const isNode = typeof process !== 'undefined' && Boolean(process.versions && process.versions.node);

let redis;
try {
    if (isNode) {
        redis = require('redis');
    }
} catch (e) {
    // Redis module not available or non-Node environment
}

const mockClient = {
    isOpen: false,
    on: () => {},
    connect: async () => {},
    get: async () => null,
    set: async () => {},
    del: async () => {}
};

const client = redis ? redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
}) : mockClient;

if (client !== mockClient) {
    client.on('error', (err) => {
        // Suppress repeated connection logs to avoid console noise when offline
        if (err.code !== 'ECONNREFUSED') {
            console.log('Redis Client Error', err);
        }
    });
}

const connectRedis = async () => {
    if (client === mockClient) return;
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
