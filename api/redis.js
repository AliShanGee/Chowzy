const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
let client;
let redis;

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
        console.warn('Redis module not found, using mock.');
    }
}

// Fallback or mock for non-node environments (e.g. Cloudflare Workers)
if (!client) {
    client = {
        on: () => {},
        connect: async () => {},
        isOpen: false,
        get: async () => null,
        set: async () => null,
        del: async () => null
    };
}

const connectRedis = async () => {
    try {
        if (!client.isOpen && typeof client.connect === 'function') {
            await client.connect();
            if (isNode) console.log('Connected to Redis');
        }
    } catch (err) {
        if (isNode) console.warn('Could not connect to Redis. App will continue without caching.');
    }
};

module.exports = { client, connectRedis };
