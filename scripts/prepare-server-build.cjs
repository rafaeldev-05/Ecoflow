const fs = require('node:fs');
const path = require('node:path');

const outputDir = path.resolve(__dirname, '..', 'dist-server');
const packageJsonPath = path.join(outputDir, 'package.json');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(packageJsonPath, `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`);
