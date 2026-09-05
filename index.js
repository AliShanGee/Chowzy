const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

let app;

if (isNode) {
  await import('dotenv/config');
  const { serve } = await import('@hono/node-server');
  const apiModule = await import('./api/index.js');
  app = apiModule.default || apiModule;
  const port = parseInt(process.env.PORT || '3001', 10);

  console.log('Starting server on port', port);

  serve({
    fetch: app.fetch || app,
    port,
  });

  console.log(`Server running at http://localhost:${port}`);
} else {
  const apiModule = await import('./api/index.js');
  app = apiModule.default || apiModule;
}

export default app;
