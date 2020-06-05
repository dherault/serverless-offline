import { resolve } from 'path'
import execa from 'execa'
import promiseMap from 'p-map'
import { checkDockerDaemon, detectExecutable } from '../../src/utils/index.js'

const executables = ['python2', 'python3', 'ruby', 'java']

const testFolders = [
  '../integration/docker/access-host/src',
  '../scenario/apollo-server-lambda',
  '../scenario/docker-serverless-webpack-test',
  '../scenario/serverless-webpack-test',
  '../scenario/serverless-plugin-typescript-test',
]

async function detectDocker() {
  try {
    await checkDockerDaemon()
  } catch (err) {
    return false
  }
  return true
}

function installNpmModules(dirPath) {
  return execa('npm', ['ci'], {
    cwd: resolve(__dirname, dirPath),
    stdio: 'inherit',
  })
}

export default async function npmInstall() {
  const [python2, python3, ruby, java] = await promiseMap(
    executables,
    (executable) =>
      executable === 'java'
        ? detectExecutable('java', '-version')
        : detectExecutable(executable),
    {
      concurrency: 1,
    },
  )

  const docker = await detectDocker()

  if (docker) {
    process.env.DOCKER_DETECTED = true
  }

  if (python2) {
    process.env.PYTHON2_DETECTED = true
  }

  if (python3) {
    process.env.PYTHON3_DETECTED = true
  }

  if (ruby) {
    process.env.RUBY_DETECTED = true
  }

  if (java) {
    process.env.JAVA_DETECTED = true
  }

  return promiseMap(testFolders, (path) => installNpmModules(path), {
    concurrency: 1,
  })
}
