'use strict';

const { exec } = require('child_process');
const fs = require('fs');

const dir = './.logs';
const now = process.env.npm_config_now || `${Date.now()}`;

if (!fs.existsSync(dir)){
    console.log('Creating logs folder ...');
    fs.mkdirSync(dir);
}

['main', 'authorizer', 'RouteSelection'].map(t => {
  const log = fs.createWriteStream(`${dir}/${now}.${t}.log`);
  const test = exec(`npm run deploy-offline ${t}`);
  test.stdout.pipe(log);
  console.log(`Spawning offline test server '${t}' [PID=${test.pid}] as a separate process ...`);

  return test;
});
