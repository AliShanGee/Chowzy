import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

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

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('Chowzy API Running', { status: 200 });
  }
};
