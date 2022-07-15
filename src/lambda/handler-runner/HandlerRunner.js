import { log } from '@serverless/utils/log.js'
import {
  supportedGo,
  supportedJava,
  supportedNodejs,
  supportedPython,
  supportedRuby,
} from '../../config/index.js'

export default class HandlerRunner {
  #env = null

  #funOptions = null

  #options = null

  #runner = null

  constructor(funOptions, options, env) {
    this.#env = env
    this.#funOptions = funOptions
    this.#options = options
  }

  async #loadRunner() {
    const { useChildProcesses, useDocker, useInProcess } = this.#options

    const { functionKey, handlerName, handlerPath, runtime, timeout } =
      this.#funOptions

    log.debug(`Loading handler... (${handlerPath})`)

    if (useDocker) {
      // https://github.com/lambci/docker-lambda/issues/329
      if (runtime === 'nodejs14.x') {
        log.warning(
          '"nodejs14.x" runtime is not supported with docker. See https://github.com/lambci/docker-lambda/issues/329',
        )
        throw new Error('Unsupported runtime')
      }

      if (runtime === 'python3.9') {
        log.warning('"python3.9" runtime is not supported with docker.')
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

      return new DockerRunner(this.#funOptions, this.#env, dockerOptions)
    }

    if (supportedNodejs.has(runtime)) {
      if (useChildProcesses) {
        const { default: ChildProcessRunner } = await import(
          './child-process-runner/index.js'
        )

        return new ChildProcessRunner(this.#funOptions, this.#env)
      }

      if (useInProcess) {
        const { default: InProcessRunner } = await import(
          './in-process-runner/index.js'
        )

        return new InProcessRunner(
          functionKey,
          handlerPath,
          handlerName,
          this.#env,
          timeout,
        )
      }

      const { default: WorkerThreadRunner } = await import(
        './worker-thread-runner/index.js'
      )

      return new WorkerThreadRunner(this.#funOptions, this.#env)
    }

    if (supportedGo.has(runtime)) {
      const { default: GoRunner } = await import('./go-runner/index.js')

      return new GoRunner(this.#funOptions, this.#env)
    }

    if (supportedPython.has(runtime)) {
      const { default: PythonRunner } = await import('./python-runner/index.js')

      return new PythonRunner(this.#funOptions, this.#env)
    }

    if (supportedRuby.has(runtime)) {
      const { default: RubyRunner } = await import('./ruby-runner/index.js')

      return new RubyRunner(this.#funOptions, this.#env)
    }

    if (supportedJava.has(runtime)) {
      const { default: JavaRunner } = await import('./java-runner/index.js')

      return new JavaRunner(this.#funOptions, this.#env)
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
