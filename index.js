import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  const port = parseInt(process.env.PORT || '3001', 10);
  console.log('Starting server on port', port);
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`Server running at http://localhost:${port}`);
}

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('Worker initialized', { status: 200 });
  }
};
