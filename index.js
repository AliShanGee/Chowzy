import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  const port = parseInt(process.env.PORT || '3001', 10);
  console.log('Starting server on port', port);

  import('@hono/node-server').then(({ serve }) => {
    serve({
      fetch: app.fetch || app,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => {
    console.error('Failed to start @hono/node-server:', err);
  });
}

export default {
  async fetch(request, env, ctx) {
    if (typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('API App Ready', { status: 200 });
  }
};
