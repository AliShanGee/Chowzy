const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server'),
    import('./api/index.js')
  ]).then(([, { serve }, apiModule]) => {
    const app = apiModule.default || apiModule;
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

export default {
  async fetch(request, env, ctx) {
    if (isNode) {
      try {
        const apiModule = await import('./api/index.js');
        const app = apiModule.default || apiModule;
        if (typeof app.fetch === 'function') {
          return app.fetch(request, env, ctx);
        }
        if (typeof app === 'function') {
          return app(request, env, ctx);
        }
      } catch (e) {
        console.error('Error executing backend handler in Node:', e);
      }
    }
    return new Response('CHOWZY API', { status: 200 });
  }
};
