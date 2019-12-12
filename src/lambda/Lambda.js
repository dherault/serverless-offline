import HttpServer from './HttpServer.js'
import LambdaFunctionPool from './LambdaFunctionPool.js'
import { DEFAULT_LAMBDA_RUNTIME } from '../config/index.js'
import { checkDockerDaemon, baseImage, pullImage } from '../utils/index.js'
import debugLog from '../debugLog.js'

export default class Lambda {
  constructor(serverless, options) {
    this._serverless = serverless
    this._options = options
    this._httpServer = new HttpServer(options, this)
    this._lambdas = new Map()
    this._lambdaFunctionNamesKeys = new Map()
    this._lambdaFunctionPool = new LambdaFunctionPool(serverless, options)
  }

  add(functionKey, functionDefinition) {
    this._lambdas.set(functionKey, functionDefinition)
    this._lambdaFunctionNamesKeys.set(functionDefinition.name, functionKey)
  }

  get(functionKey) {
    const functionDefinition = this._lambdas.get(functionKey)
    return this._lambdaFunctionPool.get(functionKey, functionDefinition)
  }

  getByFunctionName(functionName) {
    const functionKey = this._lambdaFunctionNamesKeys.get(functionName)
    return this.get(functionKey)
  }

  start() {
    return this._httpServer.start()
  }

  // stops the server
  stop(timeout) {
    return this._httpServer.stop(timeout)
  }

  async initializeDocker() {
    const runtimes = new Set()

    const { provider } = this._serverless.service
    if (provider.runtime && this._options.useDocker) {
      runtimes.add(provider.runtime)
    }

    this._lambdas.forEach((functionDefinition) => {
      const { runtime } = functionDefinition
      if (runtime && this._options.useDocker) {
        runtimes.add(runtime)
      }
    })

    if (this._options.useDocker && runtimes.size === 0) {
      runtimes.add(DEFAULT_LAMBDA_RUNTIME)
    }

    if (runtimes.size === 0) {
      // docker is not required
      // no-op
      return Promise.resolve()
    }

    return Promise.all([
      checkDockerDaemon(),
      this._pullBaseImages(runtimes),
      // FIXME
      // https://github.com/dherault/serverless-offline/issues/848
      // `sls package` sets 'AWS_PROXY' to integration automatically
      // this._package(),
    ])
  }

  async _pullBaseImages(runtimes) {
    const pull = []

    runtimes.forEach((runtime) => {
      const baseImageTag = baseImage(runtime)

      debugLog(`Downloading base Docker image... (${baseImageTag})`)

      pull.push(pullImage(baseImageTag))
    })

    return Promise.all(pull)
  }

  async _package() {
    return this._serverless.pluginManager.spawn('package')
  }

  cleanup() {
    return this._lambdaFunctionPool.cleanup()
  }
}
