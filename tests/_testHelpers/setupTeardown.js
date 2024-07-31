import process, { env } from "node:process"
import { execa } from "execa"
import treeKill from "tree-kill"
import { install, getBinary } from "serverless/binary.js"

let serverlessProcess

const shouldPrintOfflineOutput = env.PRINT_OFFLINE_OUTPUT

export async function setup(options) {
  await install()
  const binary = getBinary()
  const { args = [], env: optionsEnv, servicePath, stdoutData } = options

  serverlessProcess = execa(binary.binaryPath, ["offline", "start", ...args], {
    cwd: servicePath,
    env: optionsEnv,
  })

  if (stdoutData) {
    serverlessProcess.stderr.on("data", stdoutData)
    serverlessProcess.stdout.on("data", stdoutData)
  }

  await new Promise((res, reject) => {
    let stdData = ""

    serverlessProcess.on("close", (code) => {
      if (code) {
        console.error(`Output: ${stdData}`)
        reject(new Error("serverless offline crashed"))
      } else {
        reject(new Error("serverless offline ended prematurely"))
      }
    })

    serverlessProcess.stderr.on("data", (data) => {
      if (shouldPrintOfflineOutput) process._rawDebug(String(data))
      stdData += data
      if (String(data).includes("Server ready:")) {
        res()
      }
    })

    serverlessProcess.stdout.on("data", (data) => {
      if (shouldPrintOfflineOutput) process._rawDebug(String(data))
      stdData += data
      if (String(data).includes("Server ready:")) {
        res()
      }
    })
  })

  // TODO FIXME
  // temporary "wait" for websocket tests, this should be fixed in the code and then be removed
  await new Promise((res) => {
    setTimeout(res, 1000)
  })
}

export async function teardown() {
  // Forcefully kill the serverless process as it spawns child processes
  treeKill(serverlessProcess.pid, "SIGKILL")
  try {
    await serverlessProcess
  } catch {
    //
  }
}
