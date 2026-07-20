const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let client;
let connectRedis;

if (isNode) {
    const redis = require('redis');
    client = redis.createClient({
        url: (isNode && process.env.REDIS_URL) || 'redis://localhost:6379'
    });

    client.on('error', (err) => {
        // Suppress repeated connection logs to avoid console noise when offline
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
} else {
    // Mock client for non-Node.js environments (e.g. Cloudflare Workers)
    client = {
        isOpen: false,
        on: () => {},
        connect: async () => {},
        get: async () => null,
        set: async () => {},
        del: async () => {}
    };
    connectRedis = async () => {};
}

module.exports = { client, connectRedis };
