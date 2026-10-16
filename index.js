import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && process.env.NODE_ENV !== 'production') {
  import('@hono/node-server').then(({ serve }) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (app) {
      serve({
        fetch: app.fetch || app,
        port,
      });
      console.log(`Server running at http://localhost:${port}`);
    }
  }).catch(() => {});
}

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    if (typeof app === 'function') {
      return app(request, env, ctx);
    }
    return new Response('Chowzy API is running', { status: 200 });
  }
};
