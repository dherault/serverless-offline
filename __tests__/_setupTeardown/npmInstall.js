'use strict'

const { resolve } = require('path')
const execa = require('execa')

// setup.js
module.exports = async () => {
  return execa('npm', ['ci'], {
    cwd: resolve(__dirname, '../scenario/apollo-server-lambda'),
    stdio: 'inherit',
  })
}
