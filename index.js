import 'dotenv/config';
import { serve } from '@hono/node-server';
import expressApp from './api/index.js';

const app = expressApp.default || expressApp;
const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

const fetchHandler = (req, env, executionCtx) => {
  if (typeof app.fetch === 'function') {
    return app.fetch(req, env, executionCtx);
  }
  if (typeof app === 'function') {
    return app(req, env, executionCtx);
  }
  return new Response('Not Found', { status: 404 });
};

if (isNode) {
  const port = parseInt(process.env.PORT || '3001', 10);
  console.log('Starting server on port', port);
  serve({
    fetch: fetchHandler,
    port,
  });
  console.log(`Server running at http://localhost:${port}`);
}

export default {
  fetch: fetchHandler,
};
