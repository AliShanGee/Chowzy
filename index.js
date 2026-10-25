import app from './api/index.js';

export default {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  }
};

if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
  if (require.main === module) {
    const port = parseInt(process.env.PORT || '3001', 10);
    const { serve } = require('@hono/node-server');
    console.log('Starting server on port', port);
    serve({
      fetch: app.fetch,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }
}
