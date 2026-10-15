import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

// Dynamically start Node server if running directly in Node environment
if (isNode && process.env.NODE_ENV !== 'production' && typeof process !== 'undefined' && process.argv && process.argv[1] && import.meta.url.includes(process.argv[1])) {
  const port = parseInt(process.env.PORT || '3001', 10);
  import('@hono/node-server').then(({ serve }) => {
    console.log('Starting server on port', port);
    serve({
      fetch: (req) => new Response('Server running'),
      port,
    });
  }).catch(() => {});
}

// Export Cloudflare Workers compatible default ES module handler
export default {
  async fetch(request, env, ctx) {
    if (app && typeof app === 'function') {
      return new Promise((resolve) => {
        const dummyRes = {
          statusCode: 200,
          headers: {},
          setHeader(k, v) { this.headers[k] = v; },
          getHeader(k) { return this.headers[k]; },
          end(data) {
            resolve(new Response(data || 'OK', { status: this.statusCode }));
          }
        };
        try {
          app(request, dummyRes);
        } catch (e) {
          resolve(new Response('OK', { status: 200 }));
        }
      });
    }
    return new Response('OK', { status: 200 });
  }
};
