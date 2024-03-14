import process, { argv } from 'node:process'
import InProcessRunner from '../in-process-runner/index.js'
process.on('uncaughtException', (err) => {
  const {
    constructor: { name },
    message,
    stack,
  } = err
  process.send({
    error: {
      constructor: {
        name,
      },
      message,
      stack,
    },
  })
})
const [, , functionKey, handlerName, handlerPath] = argv
process.on('message', async (messageData) => {
  const { context, event, timeout } = messageData
  const inProcessRunner = new InProcessRunner(
    functionKey,
    handlerPath,
    handlerName,
    process.env,
    timeout,
  )
  const result = await inProcessRunner.run(event, context)
  process.send(result)
})
