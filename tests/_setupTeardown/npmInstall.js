import { resolve } from 'path'
import execa from 'execa'
import promiseMap from 'p-map'
import { detectExecutable } from '../../src/utils/index.js'

const executables = ['python2', 'python3', 'ruby']

const testFolders = [
  '../scenario/apollo-server-lambda',
  '../scenario/serverless-webpack-test',
  '../scenario/serverless-plugin-typescript-test',
]

function installNpmModules(dirPath) {
  return execa('npm', ['ci'], {
    cwd: resolve(__dirname, dirPath),
    stdio: 'inherit',
  })
}

export default async function npmInstall() {
  const [python2, python3, ruby] = await promiseMap(
    executables,
    (executable) => detectExecutable(executable),
    {
      concurrency: 1,
    },
  )

  if (python2) {
    process.env.PYTHON2_DETECTED = true
  }

  if (python3) {
    process.env.PYTHON3_DETECTED = true
  }

  if (ruby) {
    process.env.RUBY_DETECTED = true
  }

  return promiseMap(testFolders, (path) => installNpmModules(path), {
    concurrency: 1,
  })
}
