import 'dotenv/config';
import app from './api/index.js';

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    return new Response('Worker Running', { status: 200 });
  },
};
