import { Hono } from 'hono';

const app = new Hono();

app.get('*', (c) => c.text('Hello World!'));

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  Promise.all([
    import('dotenv/config'),
    import('@hono/node-server')
  ]).then(([_, { serve }]) => {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    serve({
      fetch: app.fetch,
      port,
    });
    console.log(`Server running at http://localhost:${port}`);
  }).catch((err) => console.error(err));
}

export default app;
