import InvokeContainer from './InvokeContainer.js'

export default class InvokeRunner {
  #codeDir = null
  #serverless = null
  #env = null
  #container = null

  constructor(funOptions, serverless, env) {
    const { codeDir, functionKey, handler, runtime } = funOptions

    this.#codeDir = codeDir
    this.#serverless = serverless
    this.#env = env
    this.#container = new InvokeContainer(
      env,
      functionKey,
      handler,
      runtime,
      serverless,
    )
  }

  cleanup() {
    return undefined
  }

  // context will be generated in container
  async run(event) {
    if (!this.#container.isRunning) {
      await this.#container.start('')
    }

    const result = await this.#container.request(
      event.body ? JSON.parse(event.body) : event,
    )
    return {
      body: JSON.stringify(result),
    }
  }
}
