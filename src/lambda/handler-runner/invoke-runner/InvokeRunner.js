import InvokeContainer from './InvokeContainer.js'

export default class InvokeRunner {
  #codeDir = null
  #serverless = null
  #env = null
  #container = null

  constructor(funOptions, env, dockerOptions, serverless) {
    const {
      codeDir,
      functionKey,
      handler,
      runtime,
      layers,
      provider,
      servicePath,
    } = funOptions

    this.#codeDir = codeDir
    this.#serverless = serverless
    this.#env = env
    this.#container = new InvokeContainer(
      env,
      functionKey,
      handler,
      runtime,
      layers,
      provider,
      servicePath,
      dockerOptions,
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

    let eventData = event
    if (event.body) {
      eventData =
        typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    }

    const result = await this.#container.request(eventData)
    return {
      body: JSON.stringify(result),
    }
  }
}