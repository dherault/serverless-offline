const { exec } = require('child_process');

console.log('Spawning offline as a separate process...');

const subprocess = exec('npm run start');

subprocess.stdout.pipe(process.stdout);

setTimeout(() => {
  console.log('Stopping main process and sending SIGTERM to subprocess...');
  subprocess.kill();
}, 10000);
