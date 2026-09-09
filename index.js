import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  const dotenvModule = 'dotenv/config';
  const nodeServerModule = '@hono/node-server';
  Promise.all([
    import(dotenvModule),
    import(nodeServerModule)
  ]).then(([{ default: dotenv }, { serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    serve({
      fetch: app.fetch,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => {
    console.error('Failed to initialize Node server:', err);
  });
}

export default app;
