'use strict'

module.exports = require('./constants.js')
module.exports.defaults = require('./defaults.js')
module.exports.options = require('./options.js')

const {
  supportedDotnetcore,
  supportedGo,
  supportedJava,
  supportedNodejs,
  supportedProvided,
  supportedPython,
  supportedRuby,
  supportedRuntimes,
} = require('./supportedRuntimes.js')

module.exports.supportedDotnetcore = supportedDotnetcore
module.exports.supportedGo = supportedGo
module.exports.supportedJava = supportedJava
module.exports.supportedNodejs = supportedNodejs
module.exports.supportedProvided = supportedProvided
module.exports.supportedPython = supportedPython
module.exports.supportedRuby = supportedRuby
module.exports.supportedRuntimes = supportedRuntimes
