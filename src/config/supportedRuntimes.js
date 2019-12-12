// native runtime support for AWS
// https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html

// .NET CORE
export const supportedDotnetcore = new Set([
  // deprecated
  // 'dotnetcore1.0',
  // 'dotnetcore2.0',
  // supported
  // 'dotnetcore2.1'
])

// GO
export const supportedGo = new Set(['go1.x'])

// JAVA
export const supportedJava = new Set([
  // 'java8'
])

// NODE.JS
export const supportedNodejs = new Set([
  // deprecated, but still working
  'nodejs4.3',
  'nodejs6.10',
  'nodejs8.10',
  // supported
  'nodejs10.x',
  'nodejs12.x',
])

// PROVIDED
export const supportedProvided = new Set(['provided'])

// PYTHON
export const supportedPython = new Set([
  'python2.7',
  'python3.6',
  'python3.7',
  'python3.8',
])

// RUBY
export const supportedRuby = new Set(['ruby2.5'])

// deprecated runtimes
// https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html
export const supportedRuntimes = new Set([
  ...supportedDotnetcore,
  ...supportedGo,
  ...supportedJava,
  ...supportedNodejs,
  ...supportedProvided,
  ...supportedPython,
  ...supportedRuby,
])
