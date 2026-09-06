#!/usr/bin/env node
const { appendFileSync } = require("node:fs")
const { argv, env } = require("node:process")

const args = argv.slice(2)
appendFileSync(env.DOCKER_TEST_LOG, `${JSON.stringify(args)}\n`)

switch (args[0]) {
  case "create": {
    console.log("test-container")
    break
  }
  case "start": {
    // The runtime logs this before its HTTP listener is necessarily ready.
    console.log("exec '/var/runtime/bootstrap' (cwd=/var/task, handler=)")
    break
  }
  case "port": {
    console.log("8080/tcp -> 0.0.0.0:12345")
    break
  }
  case "network": {
    console.log("172.17.0.1")
    break
  }
  default: {
    break
  }
}
