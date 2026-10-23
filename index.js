import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';
const port = parseInt(process.env.PORT || '3001', 10);

if (isNode && process.env.NODE_ENV !== 'test') {
  import('@hono/node-server').then(({ serve }) => {
    console.log('Starting server on port', port);
    serve({
      fetch: typeof app?.fetch === 'function' ? app.fetch : app,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => {
    console.warn('Failed to start Node server:', err.message);
  });
}

export default {
  async fetch(request, env, ctx) {
    if (typeof app?.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    if (typeof app === 'function') {
      return app(request, env, ctx);
    }
    return new Response('Worker initialized', { status: 200 });
  }
};
