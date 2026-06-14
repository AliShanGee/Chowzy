import 'dotenv/config';
import app from './api/index.js';

const port = process.env.PORT || 5000;

const isMain = typeof process !== 'undefined' && (process.argv[1] || '').match(/index\.(js|mjs)$/);

if (isMain) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
