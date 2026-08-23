import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);
const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  console.log('Starting server on port', port);
  if (app && typeof app.fetch === 'function') {
    serve({
      fetch: app.fetch,
      port,
    });
  }
  console.log(`Server running at http://localhost:${port}`);
}

export default {
  fetch: (request, env, ctx) => {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('Server running');
  }
};
