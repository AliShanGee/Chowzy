import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  try {
    require('dotenv/config');
    const { serve } = require('@hono/node-server');
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (app && app.fetch) {
      serve({ fetch: app.fetch, port });
    }
  } catch (err) {
    // Ignore in non-Node environments like Cloudflare Workers
  }
}

export default {
  async fetch(request, env, ctx) {
    if (typeof app === 'function') {
      return app(request, env, ctx);
    }
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('Not Found', { status: 404 });
  }
};
