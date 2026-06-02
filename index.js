import 'dotenv/config';
import { serve } from '@hono/node-server';
import { fileURLToPath } from 'url';
import expressApp from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

// Check if running as main module
const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
    console.log('Starting server on port', port);
    expressApp.init().then(() => {
        serve({
            fetch: expressApp,
            port,
        });
        console.log(`Server running at http://localhost:${port}`);
    }).catch(err => {
        console.error('Failed to initialize app:', err);
    });
}

export default expressApp;
