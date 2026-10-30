import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

console.log('Starting server on port', port);

if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
  serve({
    fetch: app.fetch || app,
    port,
  });
  console.log(`Server running at http://localhost:${port}`);
}

export default {
  async fetch(request, env, ctx) {
    if (typeof app === 'function') {
      return app(request, env, ctx);
    }
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('Chowzy Service', { status: 200 });
  }
};
