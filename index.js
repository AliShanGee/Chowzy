import { Hono } from 'hono';

const app = new Hono();

app.get('*', (c) => c.text('Hello World!'));

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node';

if (isNode) {
  import('dotenv/config').then(() => {
    import('./api/index.js');
  });
}

export default app;
