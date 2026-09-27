const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

function createMockClient() {
    return {
        on: () => {},
        get: async () => null,
        set: async () => null,
        isOpen: false,
        connect: async () => {}
    };
}

let client;

if (isNode) {
    try {
        const redis = require('redis');
        client = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        client.on('error', (err) => {
            if (err.code !== 'ECONNREFUSED') {
                console.log('Redis Client Error', err);
            }
        });
    } catch (err) {
        client = createMockClient();
    }
} else {
    client = createMockClient();
}

const connectRedis = async () => {
    if (!isNode || !client || typeof client.connect !== 'function') return;
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
