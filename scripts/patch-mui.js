const fs = require('fs');
const path = require('path');

function buildExports(pkgDir) {
  if (!fs.existsSync(pkgDir)) return;
  const files = fs.readdirSync(pkgDir);
  const exp = { ".": "./index.js" };
  for (const f of files) {
    if (f === 'package.json' || f.startsWith('.') || f === 'node') continue;
    const fullPath = path.join(pkgDir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (fs.existsSync(path.join(fullPath, 'index.js'))) {
        exp['./' + f] = './' + f + '/index.js';
      }
    } else if (f.endsWith('.js')) {
      const name = f.slice(0, -3);
      exp['./' + name] = './' + f;
    }
  }
  const pkgPath = path.join(pkgDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.exports = exp;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

buildExports('node_modules/@mui/material');
buildExports('node_modules/@mui/icons-material');
buildExports('node_modules/@mui/system');
buildExports('node_modules/@mui/utils');
