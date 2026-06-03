import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

console.log('Starting server on port', port);

// Export the app as default for Cloudflare Workers
export default app;

// Only call serve if we are in a Node environment and running this file directly
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
if (isNode) {
    serve({
      fetch: app.fetch,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
}
