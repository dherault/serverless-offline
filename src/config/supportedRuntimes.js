/* eslint-disable sort-keys */
// native runtime support for AWS
// https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html

// .NET CORE
// export const supportedDotnetcore = new Set([
// 'dotnet6',
// ])

const X86_64 = "x86_64"
const ARM64 = "arm64"

export const supportedRuntimesArchitecture = {
  "nodejs14.x": [ARM64, X86_64],
  "nodejs16.x": [ARM64, X86_64],
  "nodejs18.x": [ARM64, X86_64],
  "nodejs20.x": [ARM64, X86_64],
  "nodejs22.x": [ARM64, X86_64],
  "python3.7": [X86_64],
  "python3.8": [ARM64, X86_64],
  "python3.9": [ARM64, X86_64],
  "python3.10": [ARM64, X86_64],
  "python3.11": [ARM64, X86_64],
  "python3.12": [ARM64, X86_64],
  "ruby2.7": [ARM64, X86_64],
  "ruby3.2": [ARM64, X86_64],
  java8: [X86_64],
  "java8.al2": [ARM64, X86_64],
  java11: [ARM64, X86_64],
  java17: [ARM64, X86_64],
  "go1.x": [X86_64],
  "dotnetcore3.1": [ARM64, X86_64],
  provided: [X86_64],
  dotnet6: [ARM64, X86_64],
  "provided.al2": [ARM64, X86_64],
  "provided.al2023": [ARM64, X86_64],
}

// GO
export const supportedGo = new Set(["go1.x"])

// JAVA
export const supportedJava = new Set(["java8", "java8.al2", "java11", "java17"])

// NODE.JS
export const supportedNodejs = new Set([
  "nodejs14.x",
  "nodejs16.x",
  "nodejs18.x",
  "nodejs20.x",
  "nodejs22.x",
])

// PROVIDED
export const supportedProvided = new Set([
  "provided",
  "provided.al2",
  "provided.al2023",
])

// PYTHON
export const supportedPython = new Set([
  "python3.7",
  "python3.8",
  "python3.9",
  "python3.10",
  "python3.11",
  "python3.12",
])

// RUBY
export const supportedRuby = new Set(["ruby2.7", "ruby3.2"])

export const supportedRuntimes = new Set([
  // ...supportedDotnetcore,
  ...supportedGo,
  ...supportedJava,
  ...supportedNodejs,
  ...supportedProvided,
  ...supportedPython,
  ...supportedRuby,
])

// deprecated runtimes
// https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html
export const unsupportedDockerRuntimes = new Set([])
