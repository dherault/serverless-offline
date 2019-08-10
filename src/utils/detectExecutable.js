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

exports.detectPython = async function detectPython() {
  return detectExecutable('python')
}

exports.detectRuby = async function detectRuby() {
  return detectExecutable('ruby')
}
