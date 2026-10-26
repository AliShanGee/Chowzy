import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  (async () => {
    try {
      await import('dotenv/config');
      const { serve } = await import('@hono/node-server');
      const port = parseInt(process.env.PORT || '3001', 10);
      if (app && typeof app.fetch === 'function') {
        serve({
          fetch: app.fetch,
          port,
        });
        console.log(`Server running at http://localhost:${port}`);
      }
    } catch (err) {
      // Node server fallback
    }
  })();
}

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('Chowzy API Service', { status: 200 });
  }
};
