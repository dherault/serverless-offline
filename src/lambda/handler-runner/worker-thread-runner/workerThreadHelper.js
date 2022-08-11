import { env } from 'node:process'
import { parentPort, workerData } from 'node:worker_threads'
import InProcessRunner from '../in-process-runner/index.js'

const { functionKey, handler, servicePath, timeout, codeDir } = workerData

parentPort.on('message', async (messageData) => {
  const { context, event, port } = messageData

  // TODO we could probably cache this in the module scope?
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

  let result

  try {
    result = await inProcessRunner.run(event, context)
  } catch (err) {
    port.postMessage(err)
  }

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(result)
})
