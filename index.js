import app from './api/index.js';

// Cloudflare Workers ES Module export
export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('API Online', { status: 200 });
  }
};

// Node.js server execution (conditionally loaded to prevent Cloudflare Workers bundle errors)
const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';
if (isNode) {
  Promise.all([
    import('dotenv/config').catch(() => {}),
    import('@hono/node-server').catch(() => {})
  ]).then(([, nodeServer]) => {
    if (nodeServer && nodeServer.serve && app && typeof app.fetch === 'function') {
      const port = parseInt(process.env.PORT || '3001', 10);
      console.log('Starting Node server on port', port);
      nodeServer.serve({
        fetch: app.fetch,
        port,
      });
      console.log(`Server running at http://localhost:${port}`);
    }
  }).catch((err) => {
    console.error('Failed to start Node server:', err);
  });
}
