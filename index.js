import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && typeof require !== 'undefined' && require.main === module) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server')
  ]).then(([{ serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    const resolvedApp = app.default || app;
    serve({
      fetch: resolvedApp.fetch ? resolvedApp.fetch.bind(resolvedApp) : resolvedApp,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => {
    console.error('Failed to start Node server:', err);
  });
}

export default {
  async fetch(request, env, ctx) {
    const resolvedApp = app.default || app;
    if (resolvedApp && typeof resolvedApp.fetch === 'function') {
      return resolvedApp.fetch(request, env, ctx);
    }
    if (typeof resolvedApp === 'function') {
      return resolvedApp(request, env, ctx);
    }
    return new Response('Not Found', { status: 404 });
  }
};
