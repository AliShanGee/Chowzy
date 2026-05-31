import expressApp from './api/index.js';
import { fileURLToPath } from 'url';

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const isMain = isNode && process.argv && process.argv[1] === fileURLToPath(import.meta.url);
const port = parseInt((isNode && process.env.PORT) || '3001', 10);

if (isMain) {
  const startServer = async () => {
    try {
      await import('dotenv/config');
      console.log('Initializing and starting server on port', port);
      await expressApp.init();
      expressApp.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  };
  startServer();
}

export default expressApp;
