// NOTE: important, don't use any new javascript language features in this file!
// (other than es6 modules, which are transpiled)

import pleaseUpgradeNode from 'please-upgrade-node'
// @ts-ignore
import pkg from '../package.json'

const currentNodeVersion = process.versions.node
const requiredNodeVersion = pkg.engines.node.replace('>=', '')

pleaseUpgradeNode(pkg, {
  message: function message() {
    return (
      // eslint-disable-next-line prefer-template
      'serverless-offline requires node.js version ' +
      requiredNodeVersion +
      ' or higher, but found version ' +
      currentNodeVersion +
      '. Please upgrade!'
    )
  },
})
