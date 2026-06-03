import 'dotenv/config';
import expressApp from './api/index.js';
import { fileURLToPath } from 'url';

// Export for Cloudflare Workers (chowzy)
export default expressApp;

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const isMain = isNode && process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
    const port = parseInt(process.env.PORT || '3001', 10);
    expressApp.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
