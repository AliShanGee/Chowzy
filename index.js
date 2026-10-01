import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && process.env.NODE_ENV !== 'test') {
  const port = parseInt(process.env.PORT || '3001', 10);
  import('@hono/node-server').then(({ serve }) => {
    if (app && typeof app.fetch === 'function') {
      serve({ fetch: app.fetch, port });
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
    return new Response('Server configuration error', { status: 500 });
  }
};
