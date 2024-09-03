import { env, versions } from "node:process"
import { parentPort, workerData } from "node:worker_threads"
import { register } from "node:module"
import InProcessRunner from "../in-process-runner/index.js"

const IS_NODE_20 = Number(versions.node.split(".")[0]) >= 20

const { codeDir, functionKey, handler, servicePath, timeout, pnpLoaderPath } =
  workerData

if (pnpLoaderPath && IS_NODE_20) {
  register(pnpLoaderPath)
}

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

parentPort.on("message", async (messageData) => {
  const { context, event, port } = messageData

  let result

  try {
    result = await inProcessRunner.run(event, context)
  } catch (err) {
    port.postMessage(err)
  }

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(result)
})
