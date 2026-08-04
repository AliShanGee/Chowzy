import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  const { serve } = await import('@hono/node-server');
  const port = parseInt(process.env.PORT || '3001', 10);
  console.log('Starting server on port', port);
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`Server running at http://localhost:${port}`);
}

export default app;
