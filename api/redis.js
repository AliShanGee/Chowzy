const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let client;
let connectRedis = async () => {};

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
    console.warn('Redis module not available. Continuing without Redis cache.');
  }
} else {
  client = {
    get: async () => null,
    set: async () => {},
    del: async () => {},
    on: () => {}
  };
}

module.exports = { client, connectRedis };
