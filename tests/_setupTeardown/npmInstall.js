import { resolve } from 'node:path'
import { env } from 'node:process'
import { execa } from 'execa'
import promiseMap from 'p-map'
import {
  checkDockerDaemon,
  checkGoVersion,
  detectExecutable,
} from '../../src/utils/index.js'

const executables = ['python2', 'python3', 'ruby', 'java']

const testFolders = [
  '../integration/docker/access-host/src',
  '../scenario/apollo-server-lambda',
  '../scenario/docker-in-docker',
  '../scenario/docker-serverless-webpack-test',
  '../scenario/serverless-webpack-test',
  '../scenario/serverless-plugin-typescript-test',
]

async function detectDocker() {
  try {
    await checkDockerDaemon()
  } catch {
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
    env.DOCKER_DETECTED = true
    const dockerCompose = await detectExecutable('docker-compose')
    if (dockerCompose) {
      env.DOCKER_COMPOSE_DETECTED = true
    }
  }

  const go = await checkGoVersion()
  if (go && go === '1.x') {
    env.GO1X_DETECTED = true
  }

  if (java) {
    env.JAVA_DETECTED = true
  }

  if (python2) {
    env.PYTHON2_DETECTED = true
  }

  if (python3) {
    env.PYTHON3_DETECTED = true
  }

  if (ruby) {
    env.RUBY_DETECTED = true
  }

  return promiseMap(testFolders, (path) => installNpmModules(path), {
    concurrency: 1,
  })
}
