import 'dotenv/config';
import expressApp from './api/index.js';
import { fileURLToPath } from 'url';

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
const port = parseInt(process.env.PORT || '3001', 10);

if (isMain) {
  console.log('Initializing and starting server on port', port);
  expressApp.init().then(() => {
    expressApp.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default expressApp;
