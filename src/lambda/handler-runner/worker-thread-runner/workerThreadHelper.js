import { env } from "node:process"
import { parentPort, workerData } from "node:worker_threads"
import InProcessRunner from "../in-process-runner/index.js"

const { parse, stringify } = JSON

const { codeDir, functionKey, handler, servicePath, timeout } = workerData

const inProcessRunner = new InProcessRunner(
  {
    codeDir,
    functionKey,
    handler,
    servicePath,
    timeout,
  },
  env,
)

function postMessage(port, message) {
  try {
    port.postMessage(message)
  } catch {
    // values which can't be structured cloned (e.g. containing functions) are
    // serialized the same way the AWS Lambda runtime does it: through JSON
    let serialized

    try {
      serialized = parse(stringify(message))
    } catch (err) {
      serialized = {
        type: "error",
        value: err,
      }
    }

    port.postMessage(serialized)
  }
}

parentPort.on("message", async (messageData) => {
  const { context, event, port } = messageData

  let message

  try {
    message = {
      type: "result",
      value: await inProcessRunner.run(event, context),
    }
  } catch (err) {
    // errors are not necessarily instances of Error, e.g. callback("foo")
    message = {
      type: "error",
      value: err,
    }
  }

  postMessage(port, message)
  port.close()
})
