import 'dotenv/config';
import app from './api/index.js';

const port = parseInt(process.env.PORT || '3001', 10);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
