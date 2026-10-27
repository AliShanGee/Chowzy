const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

export default {
  async fetch(request, env, ctx) {
    try {
      const { default: app } = await import('./api/index.js');
      if (app && typeof app.fetch === 'function') {
        return await app.fetch(request, env, ctx);
      }
      return new Response('chowzy API running', { status: 200 });
    } catch (err) {
      return new Response(`Server error: ${err.message}`, { status: 500 });
    }
  }
};

if (isNode) {
  (async () => {
    try {
      await import('dotenv/config');
      const { serve } = await import('@hono/node-server');
      const apiModule = await import('./api/index.js');
      const app = apiModule.default || apiModule;
      const port = parseInt(process.env.PORT || '3001', 10);
      if (app && typeof app.fetch === 'function') {
        serve({ fetch: app.fetch, port });
        console.log(`Server running at http://localhost:${port}`);
      }
    } catch (err) {
      // Ignored when not running as primary Node server
    }
  })();
}
