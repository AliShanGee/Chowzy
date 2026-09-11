import app from './api/index.js';

const isNode = typeof process !== 'undefined' && Boolean(process.versions && process.versions.node);

if (isNode) {
  Promise.all([import('dotenv/config'), import('@hono/node-server')]).then(([{ }, { serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (app && typeof app.fetch === 'function') {
      serve({
        fetch: app.fetch,
        port,
      });
      console.log(`Server running at http://localhost:${port}`);
    }
  });
}

export default app;
