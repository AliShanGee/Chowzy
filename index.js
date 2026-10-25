// Cloudflare Workers entrypoint + Node server launcher

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && typeof process.env !== 'undefined' && process.argv && (process.argv[1]?.endsWith('index.js') || require?.main === module)) {
  (async () => {
    try {
      await import('dotenv/config');
      const { serve } = await import('@hono/node-server');
      const app = (await import('./api/index.js')).default || require('./api/index');
      const port = parseInt(process.env.PORT || '3001', 10);

      console.log('Starting server on port', port);
      if (typeof app.listen === 'function') {
        app.listen(port, () => {
          console.log(`Server running at http://localhost:${port}`);
        });
      } else if (app.fetch) {
        serve({
          fetch: app.fetch,
          port,
        });
        console.log(`Server running at http://localhost:${port}`);
      }
    } catch (err) {
      console.error('Error starting Node server:', err);
    }
  })();
}

export default {
  async fetch(request, env, ctx) {
    try {
      const app = (await import('./api/index.js')).default || require('./api/index');
      if (app && typeof app.fetch === 'function') {
        return app.fetch(request, env, ctx);
      }
      return new Response('Chowzy API Service Running', { status: 200 });
    } catch (err) {
      return new Response('Error in Workers fetch: ' + err.message, { status: 500 });
    }
  }
};
