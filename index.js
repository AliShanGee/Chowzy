import 'dotenv/config';
import app from './api/index.js';
import { fileURLToPath } from 'url';

const port = parseInt(process.env.PORT || '3001', 10);

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
    // Correctly initialize DB/Redis before starting the server
    app.init().then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    }).catch(err => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
}

export default app;
