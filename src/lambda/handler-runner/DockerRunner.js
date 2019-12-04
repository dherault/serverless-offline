import DockerContainer from './DockerContainer.js'

export default class DockerRunner {
  constructor(funOptions, env) {
    const { functionKey, handler, runtime, servicePath } = funOptions
    const artifact = servicePath
    this._container = new DockerContainer(
      env,
      functionKey,
      handler,
      runtime,
      artifact,
    )
  }

  cleanup() {
    if (this._container) {
      return this._container.stop()
    }
    return Promise.resolve()
  }

  // context will be generated in container
  async run(event) {
    if (!this._container.isRunning) {
      await this._container.run()
    }

    return this._container.request(event)
  }
}
