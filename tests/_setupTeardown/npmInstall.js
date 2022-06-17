import { resolve } from 'node:path'
import { env } from 'node:process'
import { execa } from 'execa'
import {
  checkDockerDaemon,
  checkGoVersion,
  detectExecutable,
} from '../../src/utils/index.js'

const executables = ['java', 'python3', 'ruby']

const testFolderPaths = [
  '../integration/docker/access-host/src',
  '../scenario/apollo-server-lambda',
  '../scenario/docker-in-docker',
  '../scenario/docker-serverless-webpack-test',
  '../scenario/serverless-plugin-typescript-test',
  '../scenario/serverless-webpack-test',
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
  const [java, python3, ruby] = await Promise.all(
    executables.map((executable) =>
      executable === 'java'
        ? detectExecutable('java', '-version')
        : detectExecutable(executable),
    ),
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

  if (go === '1.x') {
    env.GO1X_DETECTED = true
  }

  if (java) {
    env.JAVA_DETECTED = true
  }

  if (python3) {
    env.PYTHON3_DETECTED = true
  }

  if (ruby) {
    env.RUBY_DETECTED = true
  }

  for (const testFolderPath of testFolderPaths) {
    // eslint-disable-next-line no-await-in-loop
    await installNpmModules(testFolderPath)
  }
}
