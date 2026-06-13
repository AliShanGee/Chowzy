const app = require('./api/index.js');

module.exports = app;

const isMain = typeof process !== 'undefined' && (process.argv[1] || '').match(/index\.(js|mjs)$/);

if (isMain) {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
