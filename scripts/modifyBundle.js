'use strict'

// NOTE: this script is a quick and dirty hack that fixes a rollup bug where
// dynamic imports with a variable filepath parameter bundled to cjs throw an
// exception when executed after bundling.
// in addition, the output.interop: false option is being ignored.
// this script removes the interop block.
// TODO file bug!

const { readdir, readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')

const distPath = resolve(__dirname, '../dist')

readdir(distPath, (err, files) => {
  files.forEach((filePath) => {
    if (!filePath.startsWith('InProcessRunner')) {
      return
    }

    const fullPath = resolve(distPath, filePath)

    let content = readFileSync(fullPath, 'utf-8')

    const find = '_interopNamespace(require(handlerPath))'
    const replace = 'require(handlerPath)'

    content = content.replace(find, replace)

    writeFileSync(fullPath, content, 'utf-8')
  })
})
