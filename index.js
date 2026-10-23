import 'dotenv/config';
import app from './api/index.js';

export default {
  async fetch(request, env, ctx) {
    if (app && typeof app.fetch === 'function') {
      return app.fetch(request, env, ctx);
    }
    if (typeof app === 'function') {
      return app(request, env, ctx);
    }
    return new Response('OK', { status: 200 });
  }
};
