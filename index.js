import 'dotenv/config';
import { serve } from '@hono/node-server';
import expressApp from './api/index.js';
import { fileURLToPath } from 'url';

const port = parseInt(process.env.PORT || '3001', 10);

// Export for Cloudflare Workers
export default expressApp;

// Local server start check for ESM
const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  console.log('Starting server on port', port);

  // Since api/index.js is an Express app, if it doesn't have .fetch,
  // we might need a different way to serve it with @hono/node-server
  // or just use app.listen if we're in a Node environment.

  expressApp.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
