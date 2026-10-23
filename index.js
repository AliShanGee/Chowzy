export default {
  async fetch(request, env, ctx) {
    try {
      const appModule = await import('./api/index.js');
      const app = appModule.default || appModule;
      if (typeof app === 'function') {
        return app(request, env, ctx);
      }
      if (app && typeof app.fetch === 'function') {
        return app.fetch(request, env, ctx);
      }
    } catch (err) {
      console.error('Worker fetch error:', err);
    }
    return new Response('Chowzy API', { status: 200 });
  }
};
