"use strict"

const { env } = require("process")

let spec

if (env.TEST === undefined || env.TEST === "all") {
  spec = ["./src/**/*.test.js", "tests/**/*.test.js"]
}

if (env.TEST === "e2e") {
  spec = ["tests/end-to-end/**/*.test.js"]
}

if (env.TEST === "unit") {
  spec = ["./src/**/*.test.js", "tests/old-unit/**/*.test.js"]
}

if (env.TEST === "docker") {
  spec = ["tests/integration/docker/**/*.test.js"]
}

if (env.TEST === "node") {
  spec = [
    "./src/**/*.test.js",
    "tests/end-to-end/**/*.test.js",
    "tests/events/**/*.test.js",
    "tests/handler-module-formats/**/*.test.js",
    // 'tests/integration/**/*.test.js',
    "tests/lambda-run-mode/**/*.test.js",
    "tests/old-unit/**/*.test.js",
    // 'tests/scneario/**/*.test.js',
    "tests/timeout/**/*.test.js",
  ]
}

module.exports = {
  exclude: "**/node_modules/**/*",
  spec,
  timeout: 300000,
}
