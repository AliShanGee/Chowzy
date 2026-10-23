import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

const fetchHandler = async (request, env, ctx) => {
  if (app && typeof app.fetch === 'function') {
    return app.fetch(request, env, ctx);
  }
  try {
    const serverless = require('serverless-http');
    const handler = serverless(app);
    return await handler(request, env, ctx);
  } catch (err) {
    return new Response('Chowzy API Service Running', { status: 200 });
  }
};

if (isNode) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server')
  ]).then(([_, { serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    serve({
      fetch: fetchHandler,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch(err => {
    console.error('Failed to start Node server:', err);
  });
}

export default {
  fetch: fetchHandler
};
