import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && process.env.NODE_ENV !== 'test') {
  import('@hono/node-server').then(({ serve }) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (app && app.fetch) {
      serve({
        fetch: app.fetch,
        port,
      });
      console.log(`Server running at http://localhost:${port}`);
    }
  }).catch(err => {
    console.error('Failed to load @hono/node-server:', err);
  });
}

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    if (typeof app === 'function') {
      return app(request, env, ctx);
    }
    return new Response('Not Found', { status: 404 });
  }
};
