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
    } catch (err) {
        console.warn('Failed to load redis. App will continue without caching.', err);
        client = {
            isOpen: false,
            on: () => {},
            connect: async () => {},
            del: async () => {},
            get: async () => {},
            set: async () => {}
        };
        connectRedis = async () => {};
    }
} else {
    // Non-Node runtime (e.g. Cloudflare Worker)
    client = {
        isOpen: false,
        on: () => {},
        connect: async () => {},
        del: async () => {},
        get: async () => {},
        set: async () => {}
    };
    connectRedis = async () => {};
}

module.exports = { client, connectRedis };
