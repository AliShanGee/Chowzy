import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  const port = parseInt(process.env.PORT || '3001', 10);
  console.log('Starting server on port', port);

  import('@hono/node-server').then(({ serve }) => {
    serve({
      fetch: app.fetch,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch(() => {
    // If @hono/node-server is unavailable, express server in api/index.js handles app.listen
  });
}

export default app;
