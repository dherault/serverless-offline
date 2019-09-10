import debugLog from '../../debugLog.js'
import serverlessLog from '../../serverlessLog.js'
import {
  supportedNodejs,
  supportedPython,
  supportedRuby,
} from '../../config/index.js'
import { satisfiesVersionRange } from '../../utils/index.js'

export default class HandlerRunner {
  constructor(funOptions, options, env) {
    this._env = env
    this._funOptions = funOptions
    this._options = options
    this._runner = null
  }

  async _loadRunner() {
    const { useChildProcesses, useWorkerThreads } = this._options

    if (useWorkerThreads) {
      // worker threads
      this._verifyWorkerThreadCompatibility()

      const { default: WorkerThreadRunner } = await import(
        './WorkerThreadRunner.js'
      )
      return new WorkerThreadRunner(this._funOptions, this._env)
    }

    if (useChildProcesses) {
      const { default: ChildProcessRunner } = await import(
        './ChildProcessRunner.js'
      )
      return new ChildProcessRunner(this._funOptions, this._env)
    }

    const {
      functionName,
      handlerName,
      handlerPath,
      runtime,
      timeout,
    } = this._funOptions

    debugLog(`Loading handler... (${handlerPath})`)

    if (supportedNodejs.has(runtime)) {
      const { default: InProcessRunner } = await import('./InProcessRunner.js')
      return new InProcessRunner(
        functionName,
        handlerPath,
        handlerName,
        this._env,
        timeout,
      )
    }

    if (supportedPython.has(runtime)) {
      const { default: InvokeLocalPythonRunner } = await import(
        './InvokeLocalPythonRunner.js'
      )
      return new InvokeLocalPythonRunner(this._funOptions, this._env)
    }

    if (supportedRuby.has(runtime)) {
      const { default: InvokeLocalRubyRunner } = await import(
        './InvokeLocalRubyRunner.js'
      )
      return new InvokeLocalRubyRunner(this._funOptions, this._env)
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
      serverlessLog(
        `"worker threads" require node.js version ${requiredVersionRange}, but found version ${currentVersion}.
         To use this feature you have to update node.js to a later version.
        `,
        'serverless-offline',
        { color: 'red' },
      )

      throw new Error(
        '"worker threads" are not supported with this node.js version',
      )
    }
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
