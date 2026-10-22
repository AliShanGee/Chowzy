let app;
try {
  app = require('./api/index.js');
} catch (e) {
  // Ignored in non-Node environments
}

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv optional
  }

  if (process.env.NODE_ENV !== 'test') {
    try {
      const { serve } = require('@hono/node-server');
      const port = parseInt(process.env.PORT || '3001', 10);
      if (app && app.fetch) {
        serve({
          fetch: app.fetch,
          port,
        });
      }
    } catch (err) {
      // Ignored if @hono/node-server is not available
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    if (typeof app === 'function') {
      return app(request, env, ctx);
    }
    return new Response('GoFood API', { status: 200 });
  }
};
