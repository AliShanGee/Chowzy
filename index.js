const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server'),
    import('./api/index.js')
  ]).then(([_, { serve }, appModule]) => {
    const app = appModule.default || appModule;
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (app && app.fetch) {
      serve({
        fetch: app.fetch,
        port,
      });
    }
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => {
    console.error('Error starting Node server:', err);
  });
}

export default {
  async fetch(request, env) {
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Chowzy API / Web', { status: 200 });
  }
};
