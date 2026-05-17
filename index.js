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
  // Fallback for standard Express app in Node environment
  app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
  });
}
