import { env } from "node:process"
import { parentPort, workerData } from "node:worker_threads"
import InProcessRunner from "../in-process-runner/index.js"

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

parentPort.on("message", async (messageData) => {
  const { context, event, isStreamingResponse, port } = messageData

  let result

  try {
    result = await inProcessRunner.run(event, context, isStreamingResponse)
  } catch (err) {
    port.postMessage(err)
    return
  }

  // For streaming responses, forward chunks through the message port
  // eslint-disable-next-line no-underscore-dangle
  if (isStreamingResponse && result?._isStreamingResponse && result.stream) {
    port.postMessage({
      headers: result.headers,
      statusCode: result.statusCode,
      type: "streamStart",
    })

    result.stream.on("data", (chunk) => {
      port.postMessage({ chunk, type: "streamChunk" })
    })

    result.stream.on("end", () => {
      port.postMessage({ type: "streamEnd" })
    })

    result.stream.on("error", (err) => {
      port.postMessage({ message: err.message, type: "streamError" })
    })

    return
  }

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(result)
})
