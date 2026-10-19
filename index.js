import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      const { serve } = await import('@hono/node-server');
      const port = parseInt(process.env.PORT || '3001', 10);
      console.log('Starting server on port', port);
      serve({
        fetch: app.fetch || app,
        port,
      });
      console.log(`Server running at http://localhost:${port}`);
    } catch (e) {
      console.error('Failed to start Node server:', e);
    }
  };
  startServer();
}

export default {
  async fetch(request, env, ctx) {
    if (typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('API App Loaded', { status: 200 });
  }
};
