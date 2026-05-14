import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

console.log('Starting server on port', port);

if (app.fetch) {
  serve({
    fetch: app.fetch,
    port,
  });
} else {
  // Fallback to Express listen if it's not a Hono app (e.g. locally or via other means)
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
