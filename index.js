import 'dotenv/config';
import { fileURLToPath } from 'url';
import expressApp from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  expressApp.init().then(() => {
    expressApp.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  });
}

export default expressApp;
