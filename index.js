import 'dotenv/config';
import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

if (isNode) {
  // Use a dynamic import or require-style check that won't break the build
  const isMain = (process.argv[1] || '').match(/index\.(js|mjs)$/);

  if (isMain) {
    const port = parseInt(process.env.PORT || '3001', 10);
    // Express app already handles listening if required, or we can use app.listen here
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }
}

export default app;
