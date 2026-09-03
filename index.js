import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server')
  ]).then(([_, { serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    serve({
      fetch: (app && typeof app.fetch === 'function') ? app.fetch : app,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch(() => {});
}

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('GoFood API', { status: 200 });
  }
};
