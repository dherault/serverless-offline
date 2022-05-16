import { env } from 'process'
import { parentPort, workerData } from 'worker_threads' // eslint-disable-line import/no-unresolved
import InProcessRunner from '../in-process-runner/index.js'

const { functionKey, handlerName, handlerPath, handlerModuleNesting } =
  workerData

parentPort.on('message', async (messageData) => {
  const { context, event, port, timeout, allowCache } = messageData

  // TODO we could probably cache this in the module scope?
  const inProcessRunner = new InProcessRunner(
    functionKey,
    handlerPath,
    handlerName,
    handlerModuleNesting,
    env,
    timeout,
    allowCache,
  )

  const result = await inProcessRunner.run(event, context)

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(result)
})
