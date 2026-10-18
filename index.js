import 'dotenv/config';
import app from './api/index.js';

export default {
  async fetch(request, env, ctx) {
    if (typeof app === 'function') {
      return app(request, env, ctx);
    }
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('OK', { status: 200 });
  }
};

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && typeof process.argv !== 'undefined' && process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  const { serve } = await import('@hono/node-server');
  const port = parseInt(process.env.PORT || '3001', 10);

  console.log('Starting server on port', port);

  serve({
    fetch: app.fetch || ((req) => app(req)),
    port,
  });

  console.log(`Server running at http://localhost:${port}`);
}
