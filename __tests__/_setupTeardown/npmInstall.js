import { resolve } from 'path'
import execa from 'execa'

// setup.js
export default async function npmInstall() {
  return execa('npm', ['ci'], {
    cwd: resolve(__dirname, '../scenario/apollo-server-lambda'),
    stdio: 'inherit',
  })
}
