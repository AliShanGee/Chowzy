import app from './api/index.js';

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  Promise.all([import('dotenv/config'), import('node:http')]).then(([{ }, http]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    http.createServer(app).listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  });
}

export default app;
