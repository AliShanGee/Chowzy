const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const { createClient } = require('redis');

const client = isNode ? createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
}) : {
    on: () => {},
    connect: async () => {},
    isOpen: false
};

if (isNode) {
    client.on('error', (err) => console.error('Redis Client Error', err));
}

const connectRedis = async () => {
    if (!isNode) return;
    try {
        if (!client.isOpen) {
            await client.connect();
            console.log('Connected to Redis');
        }
    } catch (err) {
        console.error('Redis connection failed:', err.message);
    }
};

module.exports = { client, connectRedis };
