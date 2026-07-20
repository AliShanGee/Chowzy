import 'dotenv/config';

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

if (isNode) {
  // Dynamically import Node-specific modules to prevent bundling/resolution errors on non-Node platforms (like Cloudflare Workers)
  Promise.all([
    import('@hono/node-server'),
    import('./api/index.js')
  ]).then(([{ serve }, { default: app }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    if (app && typeof app.fetch === 'function') {
      serve({
        fetch: app.fetch,
        port,
      });
    } else {
      console.log('Express app started via direct API listen.');
    }
  }).catch((err) => {
    console.error('Error starting server via Hono node-server:', err);
  });
}

// Fallback/standard export for Cloudflare Workers environment
export default {
  async fetch(request, env, ctx) {
    return new Response('Hello from Chowzy backend on Cloudflare Workers!');
  }
};
