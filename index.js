const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  try {
    const dynamicImport = (pkg) => Function('p', 'return import(p)')(pkg);
    const dynamicRequire = (pkg) => Function('p', 'return require(p)')(pkg);

    const app = dynamicRequire('./api/index.js');
    Promise.all([
      dynamicImport('dotenv/config'),
      dynamicImport('@hono/node-server')
    ]).then(([_, nodeServer]) => {
      const serve = nodeServer.serve;
      const port = parseInt(process.env.PORT || '3001', 10);
      console.log('Starting server on port', port);
      if (typeof serve === 'function') {
        serve({
          fetch: app.fetch || ((req) => new Response('OK')),
          port,
        });
        console.log(`Server running at http://localhost:${port}`);
      }
    }).catch((err) => {
      console.error('Error starting Node server:', err);
    });
  } catch (err) {
    console.error('Error loading API in Node:', err);
  }
}

export default {
  async fetch(request, env, ctx) {
    return new Response('Chowzy API Worker');
  }
};
