import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode && typeof process.argv !== 'undefined' && process.argv[1] && process.argv[1].endsWith('index.js')) {
  Promise.all([
    import('dotenv/config').catch(() => {}),
    import('@hono/node-server').catch(() => {})
  ]).then(([_, honoServer]) => {
    if (honoServer && honoServer.serve) {
      const port = parseInt(process.env.PORT || '3001', 10);
      honoServer.serve({
        fetch: app.fetch || app,
        port,
      });
      console.log(`Server running at http://localhost:${port}`);
    }
  }).catch(() => {});
}

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    if (typeof app === 'function') {
      return new Promise((resolve, reject) => {
        try {
          app(request, env, (res) => {
            resolve(res);
          });
        } catch (err) {
          reject(err);
        }
      });
    }
    return new Response('Server initialized', { status: 200 });
  }
};
