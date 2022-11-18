// native runtime support for AWS
// https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html

// .NET CORE
// export const supportedDotnetcore = new Set([
// 'dotnet6',
// 'dotnetcore3.1',
// ])

// GO
export const supportedGo = new Set(['go1.x'])

// JAVA
export const supportedJava = new Set(['java8', 'java8.al2', 'java11'])

// NODE.JS
export const supportedNodejs = new Set([
  'nodejs12.x',
  'nodejs14.x',
  'nodejs16.x',
  'nodejs18.x',
])

// PROVIDED
export const supportedProvided = new Set(['provided', 'provided.al2'])

// PYTHON
export const supportedPython = new Set([
  'python3.6',
  'python3.7',
  'python3.8',
  'python3.9',
])

// RUBY
export const supportedRuby = new Set(['ruby2.7'])

// deprecated runtimes
// https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html
export const supportedRuntimes = new Set([
  // ...supportedDotnetcore,
  ...supportedGo,
  ...supportedJava,
  ...supportedNodejs,
  ...supportedProvided,
  ...supportedPython,
  ...supportedRuby,
])

export const unsupportedDockerRuntimes = new Set([
  'nodejs14.x',
  'nodejs16.x',
  'nodejs18.x',
  'python3.9',
])
