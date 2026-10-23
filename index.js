let appFetch = null;

export default {
  async fetch(request, env, ctx) {
    if (!appFetch) {
      try {
        const appModule = await import('./api/index.js');
        const app = appModule.default || appModule;
        appFetch = app.fetch || app;
      } catch (e) {
        console.error('Error initializing app in fetch handler:', e);
      }
    }
    if (typeof appFetch === 'function') {
      return appFetch(request, env, ctx);
    }
    if (appFetch && typeof appFetch.fetch === 'function') {
      return appFetch.fetch(request, env, ctx);
    }
    return new Response('Server running', { status: 200 });
  }
};

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';
if (isNode && typeof require !== 'undefined' && require.main === module) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server'),
    import('./api/index.js')
  ]).then(([_, { serve }, appModule]) => {
    const app = appModule.default || appModule;
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    serve({
      fetch: app.fetch || app,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => {
    console.error('Failed to start node server:', err);
  });
}
