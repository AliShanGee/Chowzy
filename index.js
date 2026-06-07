import 'dotenv/config';
import app from './api/index.js';

const port = process.env.PORT || 5000;

// Export the app for Cloudflare Workers
export default app;

// Only start the listener if running directly in Node
if (typeof require !== 'undefined' && require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
