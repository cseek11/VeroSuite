const { spawn } = require('child_process');
const path = require('path');

const mainPath = path.join(__dirname, 'dist', 'apps', 'api', 'src', 'main.js');
console.log(`Starting server from: ${mainPath}`);
const proc = spawn('node', [mainPath], { stdio: 'inherit', shell: true });
proc.on('exit', (code) => process.exit(code));
