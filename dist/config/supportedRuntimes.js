export const supportedDotnetcore = new Set([])
export const supportedGo = new Set(['go1.x'])
export const supportedJava = new Set(['java8', 'java8.al2', 'java11'])
export const supportedNodejs = new Set([
  'nodejs12.x',
  'nodejs14.x',
  'nodejs16.x',
  'nodejs18.x',
  'nodejs20.x',
])
export const supportedProvided = new Set(['provided', 'provided.al2'])
export const supportedPython = new Set([
  'python3.6',
  'python3.7',
  'python3.8',
  'python3.9',
])
export const supportedRuby = new Set(['ruby2.7'])
export const supportedRuntimes = new Set([
  ...supportedDotnetcore,
  ...supportedGo,
  ...supportedJava,
  ...supportedNodejs,
  ...supportedProvided,
  ...supportedPython,
  ...supportedRuby,
])
