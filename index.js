import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './api/index.js';

const fetchHandler = async (request, env, ctx) => {
  if (app && typeof app.fetch === 'function') {
    return app.fetch(request, env, ctx);
  }
  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

const port = parseInt(process.env.PORT || '3001', 10);

if (process.env.NODE_ENV !== 'test' && typeof process !== 'undefined' && process.release?.name === 'node') {
  try {
    serve({
      fetch: fetchHandler,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    console.error('Failed to start node server:', err);
  }
}

export default {
  fetch: fetchHandler
};
