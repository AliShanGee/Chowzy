import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  Promise.all([import('dotenv/config'), import('@hono/node-server')]).then(([_, { serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    serve({
      fetch: app.fetch || app,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => {
    console.error('Failed to start Node server:', err);
  });
}

export default app;
