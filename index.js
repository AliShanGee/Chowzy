import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (typeof app === 'function' && !app.fetch) {
  app.fetch = (request, env, ctx) => new Response('Chowzy API Running', { status: 200 });
}

if (isNode) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server')
  ]).then(([{ }, { serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (typeof app.listen === 'function') {
      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    }
  });
}

export default app;
