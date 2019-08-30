'use strict'

// native runtime support for AWS
// https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html

// .NET CORE
const supportedDotnetcore = new Set([
  // deprecated
  // 'dotnetcore1.0',
  // 'dotnetcore2.0',
  // supported
  // 'dotnetcore2.1'
])

// GO
const supportedGo = new Set([
  // 'go1.x'
])

// JAVA
const supportedJava = new Set([
  // 'java8'
])

// NODE.JS
const supportedNodejs = new Set([
  // deprecated, but still working
  'nodejs4.3',
  'nodejs6.10',
  // supported
  'nodejs8.10',
  'nodejs10.x',
])

// PROVIDED
const supportedProvided = new Set(['provided'])

// PYTHON
const supportedPython = new Set(['python2.7', 'python3.6', 'python3.7'])

// RUBY
const supportedRuby = new Set(['ruby2.5'])

exports.supportedDotnetcore = supportedDotnetcore
exports.supportedGo = supportedGo
exports.supportedJava = supportedJava
exports.supportedNodejs = supportedNodejs
exports.supportedProvided = supportedProvided
exports.supportedPython = supportedPython
exports.supportedRuby = supportedRuby

// deprecated runtimes
// https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html
exports.supportedRuntimes = new Set([
  ...supportedDotnetcore,
  ...supportedGo,
  ...supportedJava,
  ...supportedNodejs,
  ...supportedProvided,
  ...supportedPython,
  ...supportedRuby,
])
