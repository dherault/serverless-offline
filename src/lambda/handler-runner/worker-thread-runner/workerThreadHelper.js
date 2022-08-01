import { env } from 'node:process'
import { parentPort, workerData } from 'node:worker_threads'
import InProcessRunner from '../in-process-runner/index.js'

const { functionKey, handlerName, handlerPath, timeout } = workerData

parentPort.on('message', async (messageData) => {
  const { context, event, port } = messageData

  // TODO we could probably cache this in the module scope?
  const inProcessRunner = new InProcessRunner(
    functionKey,
    handlerPath,
    handlerName,
    env,
    timeout,
  )

  let result

  try {
    result = await inProcessRunner.run(event, context)
  } catch (err) {
    port.postMessage(err)
  }

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(result)
})
