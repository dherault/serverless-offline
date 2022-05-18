import { env } from 'node:process'
import { parentPort, workerData } from 'node:worker_threads' // eslint-disable-line import/no-unresolved
import InProcessRunner from '../in-process-runner/index.js'

const { functionKey, handlerName, handlerPath } = workerData

parentPort.on('message', async (messageData) => {
  const { context, event, port, timeout, allowCache } = messageData

  // TODO we could probably cache this in the module scope?
  const inProcessRunner = new InProcessRunner(
    functionKey,
    handlerPath,
    handlerName,
    env,
    timeout,
    allowCache,
  )

  const result = await inProcessRunner.run(event, context)

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(result)
})
