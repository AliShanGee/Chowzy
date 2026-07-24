const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let client;
let connectRedis;

if (isNode) {
    try {
        const redis = require('redis');
        client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
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
    } catch (e) {
        console.warn('Failed to initialize Redis client:', e);
        // Fallback mock client
        client = {
            on: () => {},
            connect: async () => {},
            isOpen: false,
            get: async () => null,
            set: async () => null,
            del: async () => null,
        };
        connectRedis = async () => {};
    }
} else {
    // Non-Node environment (e.g. Cloudflare Workers, browsers, edge)
    client = {
        on: () => {},
        connect: async () => {},
        isOpen: false,
        get: async () => null,
        set: async () => null,
        del: async () => null,
    };
    connectRedis = async () => {};
}

module.exports = { client, connectRedis };
