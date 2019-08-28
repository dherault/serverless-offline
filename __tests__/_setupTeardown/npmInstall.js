'use strict'

const { resolve } = require('path')
const execa = require('execa')

module.exports = async function npmInstall() {
  return execa('npm', ['ci'], {
    cwd: resolve(__dirname, '../scenario/apollo-server-lambda'),
    stdio: 'inherit',
  })
}
