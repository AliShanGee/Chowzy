import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && typeof process.env.PORT !== 'undefined') {
  const port = parseInt(process.env.PORT || '3001', 10);
  import('@hono/node-server').then(({ serve }) => {
    console.log('Starting server on port', port);
    serve({
      fetch: app.fetch || app,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => {
    console.error('Failed to load @hono/node-server:', err);
  });
}

export default {
  async fetch(request, env, ctx) {
    if (typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return app(request, env, ctx);
  }
};
