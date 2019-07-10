'use strict';

const { exec } = require('child_process');

console.log('Spawning offline as a separate process...');

const main = exec('npm run deploy-offline main');
main.stdout.pipe(process.stdout);
const authorizer = exec('npm run deploy-offline authorizer');
authorizer.stdout.pipe(process.stdout);
const rs = exec('npm run deploy-offline RouteSelection');
rs.stdout.pipe(process.stdout);

// setTimeout(() => {
//   console.log('Stopping main process and sending SIGTERM to subprocess...');
//   subprocess.kill();
// }, 10000);
