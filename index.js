import 'dotenv/config';
import { fileURLToPath } from 'url';
import expressApp from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

// For Cloudflare Workers (chowzy) compatibility
export default expressApp;

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  console.log('Starting server on port', port);

  if (expressApp.init) {
    expressApp.init().then(() => {
      expressApp.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    }).catch(err => {
      console.error('Failed to initialize app:', err);
      process.exit(1);
    });
  } else {
    expressApp.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}
