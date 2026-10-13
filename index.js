import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

console.log('Starting server on port', port);

if (app) {
  serve({
    fetch: app.fetch || app,
    port,
  });
}

console.log(`Server running at http://localhost:${port}`);

export default {
  fetch: app?.fetch || app,
};
