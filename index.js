import 'dotenv/config';
import expressApp from './api/index.js';
import { fileURLToPath } from 'url';

const port = parseInt(process.env.PORT || '3001', 10);

// Use default export for Cloudflare Workers (chowzy)
export default expressApp;

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  console.log('Starting server on port', port);
  expressApp.init().then(() => {
    expressApp.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch(err => {
    console.error('Failed to initialize app:', err);
    if (process.exit) process.exit(1);
  });
}
