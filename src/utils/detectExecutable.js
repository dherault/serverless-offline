'use strict'

const execa = require('execa')

async function detectExecutable(exe) {
  try {
    const { failed } = await execa(exe, ['--version'])

    return failed === false
  } catch (e) {
    return false
  }
}

exports.detectPython2 = async function detectPython2() {
  return detectExecutable('python2')
}

exports.detectPython3 = async function detectPython3() {
  return detectExecutable('python3')
}

exports.detectRuby = async function detectRuby() {
  return detectExecutable('ruby')
}
