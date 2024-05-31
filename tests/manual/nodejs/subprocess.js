"use strict"

const { exec } = require("node:child_process")
const process = require("node:process")

console.log("Spawning offline as a separate process...")

const subprocess = exec("npm run start")

subprocess.stdout.pipe(process.stdout)

setTimeout(() => {
  console.log("Stopping main process and sending SIGTERM to subprocess...")
  subprocess.kill()
}, 10_000)
