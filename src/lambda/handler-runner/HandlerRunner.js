import debugLog from '../../debugLog.js'
import { logWarning } from '../../serverlessLog.js'
import {
  supportedNodejs,
  supportedPython,
  supportedRuby,
  supportedRuntimesWithDocker,
} from '../../config/index.js'
import { satisfiesVersionRange } from '../../utils/index.js'
import DockerRunner from './DockerRunner.js'

export default class HandlerRunner {
  constructor(funOptions, options, env, docker) {
    this._env = env
    this._funOptions = funOptions
    this._options = options
    this._docker = docker
    this._runner = null
  }

  async _loadRunner() {
    const { useDocker, useChildProcesses, useWorkerThreads } = this._options

    const {
      functionKey,
      handlerName,
      handlerPath,
      runtime,
      timeout,
    } = this._funOptions

    debugLog(`Loading handler... (${handlerPath})`)

    if (useDocker && supportedRuntimesWithDocker.has(runtime)) {
      return new DockerRunner(this._funOptions, this._env, this._docker)
    }

    if (supportedNodejs.has(runtime)) {
      if (useChildProcesses) {
        const { default: ChildProcessRunner } = await import(
          './ChildProcessRunner.js'
        )
        return new ChildProcessRunner(this._funOptions, this._env)
      }

      if (useWorkerThreads) {
        // worker threads
        this._verifyWorkerThreadCompatibility()

        const { default: WorkerThreadRunner } = await import(
          './WorkerThreadRunner.js'
        )
        return new WorkerThreadRunner(this._funOptions, this._env)
      }

      const { default: InProcessRunner } = await import('./InProcessRunner.js')
      return new InProcessRunner(
        functionKey,
        handlerPath,
        handlerName,
        this._env,
        timeout,
      )
    }

    if (supportedPython.has(runtime)) {
      const { default: PythonRunner } = await import('./PythonRunner.js')
      return new PythonRunner(this._funOptions, this._env)
    }

    if (supportedRuby.has(runtime)) {
      const { default: RubyRunner } = await import('./RubyRunner.js')
      return new RubyRunner(this._funOptions, this._env)
    }

    if (supportedRuntimesWithDocker.has(runtime)) {
      return new DockerRunner(this._funOptions, this._env, this._docker)
    }

    // TODO FIXME
    throw new Error('Unsupported runtime')
  }

  _verifyWorkerThreadCompatibility() {
    const { node: currentVersion } = process.versions
    const requiredVersionRange = '>=11.7.0'

    const versionIsSatisfied = satisfiesVersionRange(
      currentVersion,
      requiredVersionRange,
    )

    // we're happy
    if (!versionIsSatisfied) {
      logWarning(
        `"worker threads" require node.js version ${requiredVersionRange}, but found version ${currentVersion}.
         To use this feature you have to update node.js to a later version.
        `,
      )

      throw new Error(
        '"worker threads" are not supported with this node.js version',
      )
    }
  }

  isDockerRunner() {
    if (!this._runner) {
      return false
    }
    return this._runner instanceof DockerRunner
  }

  // () => Promise<void>
  cleanup() {
    // TODO console.log('handler runner cleanup')
    return this._runner.cleanup()
  }

  async run(event, context) {
    if (this._runner == null) {
      this._runner = await this._loadRunner()
    }

    return this._runner.run(event, context)
  }
}
