import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import expressApp from './api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = parseInt(process.env.PORT || '3001', 10);

// Check if this module is being run directly
const isMain = process.argv[1] === __filename;

if (isMain) {
  console.log('Starting server on port', port);

  expressApp.init().then(() => {
    expressApp.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch(err => {
    console.error('Failed to initialize application:', err);
    process.exit(1);
  });
}

export default expressApp;
