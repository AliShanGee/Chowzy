import 'dotenv/config';
import app from './api/index.js';

export default app;

const isMain = typeof process !== 'undefined' && (process.argv[1] || '').match(/index\.(js|mjs)$/);

if (isMain) {
    const port = parseInt(process.env.PORT || '3001', 10);
    console.log('Starting server on port', port);
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
