'use strict'

const { env } = require('node:process')

exports.mochaHooks = {
  async beforeAll() {
    const { checkDockerDaemon, checkGoVersion, detectExecutable } =
      await import('../src/utils/index.js')

    const executables = ['java', 'python3', 'ruby']

    async function detectDocker() {
      try {
        await checkDockerDaemon()
      } catch {
        return false
      }
      return true
    }

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
  },
}
