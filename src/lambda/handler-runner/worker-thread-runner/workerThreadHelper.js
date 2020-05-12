import { parentPort, workerData } from 'worker_threads' // eslint-disable-line import/no-unresolved
import InProcessRunner from '../in-process-runner/index.js'

const { functionKey, handlerName, handlerPath, options } = workerData

parentPort.on('message', async (messageData) => {
  const { context, event, port, timeout } = messageData

  // TODO we could probably cache this in the module scope?
  const inProcessRunner = new InProcessRunner(
    functionKey,
    handlerPath,
    handlerName,
    process.env,
    timeout,
    options,
  )

  let result

  try {
    result = await inProcessRunner.run(event, context)
  } catch (err) {
    // this only executes when we have an exception caused by synchronous code
    // TODO logging
    console.log(err)
    throw err
  }

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(result)
})
