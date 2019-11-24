import execa from 'execa'
import checkDockerDaemon from './checkDockerDaemon.js'

async function detectExecutable(exe) {
  try {
    const { failed } = await execa(exe, ['--version'])

    return failed === false
  } catch (e) {
    return false
  }
}

export async function detectPython2() {
  return detectExecutable('python2')
}

export async function detectPython3() {
  return detectExecutable('python3')
}

export async function detectRuby() {
  return detectExecutable('ruby')
}

export async function detectDocker() {
  try {
    await checkDockerDaemon()
  } catch (e) {
    return false
  }
  return true
}
