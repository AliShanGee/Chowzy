import 'dotenv/config';
import app from './api/index.js';

export default app;

const port = parseInt(process.env.PORT || '3001', 10);

if (typeof require !== 'undefined' && require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
