import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  try {
    require('dotenv/config');
    const { serve } = require('@hono/node-server');
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (app && typeof app.fetch === 'function') {
      serve({ fetch: app.fetch, port });
    }
  } catch (err) {
    console.error('Node server start error:', err);
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
    return new Response('GoFood API Service Running', { status: 200 });
  }
};
