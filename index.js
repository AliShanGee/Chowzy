import 'dotenv/config';
import app from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

// Check if this is the main module
const isMain = typeof process !== 'undefined' && (process.argv[1] || '').match(/index\.(js|mjs)$/);

if (isMain) {
  console.log('Starting server on port', port);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
