const execa = require('execa')

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
