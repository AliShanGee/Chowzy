import rawApp from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';
const app = rawApp && rawApp.default ? rawApp.default : rawApp;

if (isNode) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server')
  ]).then(([, { serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (app && app.fetch) {
      serve({
        fetch: app.fetch,
        port,
      });
      console.log(`Server running at http://localhost:${port}`);
    }
  }).catch(err => {
    console.error('Error starting Node server:', err);
  });
}

export default app;
