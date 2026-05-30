require('dotenv').config();
const app = require('./api/index.js');

const port = parseInt(process.env.PORT || '3001', 10);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;
