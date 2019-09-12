import { resolve } from 'path'
import execa from 'execa'
import {
  detectPython2,
  detectPython3,
  detectRuby,
} from '../../src/utils/index.js'

export default async function npmInstall() {
  const [python2, python3, ruby] = await Promise.all([
    detectPython2(),
    detectPython3(),
    detectRuby(),
  ])

  if (python2) {
    process.env.PYTHON2_DETECTED = true
  }

  if (python3) {
    process.env.PYTHON3_DETECTED = true
  }

  if (ruby) {
    process.env.RUBY_DETECTED = true
  }

  return execa('npm', ['ci'], {
    cwd: resolve(__dirname, '../scenario/apollo-server-lambda'),
    stdio: 'inherit',
  })
}
