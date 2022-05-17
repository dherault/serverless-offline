import debugLog from '../../debugLog.js'
import { logWarning } from '../../serverlessLog.js'
import {
  supportedNodejs,
  supportedPython,
  supportedRuby,
  supportedJava,
  supportedGo,
} from '../../config/index.js'

export default class HandlerRunner {
  #env = null
  #funOptions = null
  #options = null
  #runner = null

  constructor(funOptions, options, env, v3Utils) {
    this.#env = env
    this.#funOptions = funOptions
    this.#options = options
    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
  }

  async #loadRunner() {
    const { useDocker, useChildProcesses, useWorkerThreads, allowCache } =
      this.#options

    const { functionKey, handlerName, handlerPath, runtime, timeout } =
      this.#funOptions

    if (this.log) {
      this.log.debug(`Loading handler... (${handlerPath})`)
    } else {
      debugLog(`Loading handler... (${handlerPath})`)
    }

    if (useDocker) {
      // https://github.com/lambci/docker-lambda/issues/329
      if (runtime === 'nodejs14.x') {
        if (this.log) {
          this.log.warning(
            '"nodejs14.x" runtime is not supported with docker. See https://github.com/lambci/docker-lambda/issues/329',
          )
        } else {
          logWarning(
            '"nodejs14.x" runtime is not supported with docker. See https://github.com/lambci/docker-lambda/issues/329',
          )
        }
        throw new Error('Unsupported runtime')
      }

      if (runtime === 'python3.9') {
        if (this.log) {
          this.log.warning('"python3.9" runtime is not supported with docker.')
        } else {
          logWarning('"python3.9" runtime is not supported with docker.')
        }
        throw new Error('Unsupported runtime')
      }

      const dockerOptions = {
        host: this.#options.dockerHost,
        hostServicePath: this.#options.dockerHostServicePath,
        layersDir: this.#options.layersDir,
        network: this.#options.dockerNetwork,
        readOnly: this.#options.dockerReadOnly,
      }

      const { default: DockerRunner } = await import('./docker-runner/index.js')
      return new DockerRunner(
        this.#funOptions,
        this.#env,
        dockerOptions,
        this.v3Utils,
      )
    }

    if (supportedNodejs.has(runtime)) {
      if (useChildProcesses) {
        const { default: ChildProcessRunner } = await import(
          './child-process-runner/index.js'
        )
        return new ChildProcessRunner(
          this.#funOptions,
          this.#env,
          allowCache,
          this.v3Utils,
        )
      }

      if (useWorkerThreads) {
        const { default: WorkerThreadRunner } = await import(
          './worker-thread-runner/index.js'
        )
        return new WorkerThreadRunner(this.#funOptions, this.#env, allowCache)
      }

      const { default: InProcessRunner } = await import(
        './in-process-runner/index.js'
      )
      return new InProcessRunner(
        functionKey,
        handlerPath,
        handlerName,
        this.#env,
        timeout,
        allowCache,
      )
    }

    if (supportedGo.has(runtime)) {
      const { default: GoRunner } = await import('./go-runner/index.js')
      return new GoRunner(this.#funOptions, this.#env, this.v3Utils)
    }

    if (supportedPython.has(runtime)) {
      const { default: PythonRunner } = await import('./python-runner/index.js')
      return new PythonRunner(
        this.#funOptions,
        this.#env,
        allowCache,
        this.v3Utils,
      )
    }

    if (supportedRuby.has(runtime)) {
      const { default: RubyRunner } = await import('./ruby-runner/index.js')
      return new RubyRunner(
        this.#funOptions,
        this.#env,
        allowCache,
        this.v3Utils,
      )
    }

    if (supportedJava.has(runtime)) {
      const { default: JavaRunner } = await import('./java-runner/index.js')
      return new JavaRunner(
        this.#funOptions,
        this.#env,
        allowCache,
        this.v3Utils,
      )
    }

    // TODO FIXME
    throw new Error('Unsupported runtime')
  }

  // TEMP TODO FIXME
  isDockerRunner() {
    return this.#runner && this.#runner.constructor.name === 'DockerRunner'
  }

  // () => Promise<void>
  cleanup() {
    // TODO console.log('handler runner cleanup')
    return this.#runner.cleanup()
  }

  async run(event, context) {
    if (this.#runner == null) {
      this.#runner = await this.#loadRunner()
    }

    return this.#runner.run(event, context)
  }
}
