'use strict'

const updateNotifier = require('update-notifier')
const { functionCacheCleanup } = require('./createExternalHandler.js')
const debugLog = require('./debugLog.js')
const serverlessLog = require('./serverlessLog.js')
const {
  // hasHttpEvent,
  hasWebsocketEvent,
  satisfiesVersionRange,
} = require('./utils/index.js')
const {
  CUSTOM_OPTION,
  defaults,
  options: commandOptions,
  SERVER_SHUTDOWN_TIMEOUT,
} = require('./config/index.js')
const pkg = require('../package.json')

module.exports = class ServerlessOffline {
  constructor(serverless, options) {
    this._apiGateway = null
    this._apiGatewayWebSocket = null

    // capture clean process.env
    this._env = {
      ...process.env,
    }

    this._options = options
    this._provider = serverless.service.provider
    this._serverless = serverless
    this._service = serverless.service

    serverlessLog.setLog((...args) => serverless.cli.log(...args))

    this.commands = {
      offline: {
        // add start nested options
        commands: {
          start: {
            lifecycleEvents: ['init', 'end'],
            options: commandOptions,
            usage:
              'Simulates API Gateway to call your lambda functions offline using backward compatible initialization.',
          },
        },
        lifecycleEvents: ['start'],
        options: commandOptions,
        usage: 'Simulates API Gateway to call your lambda functions offline.',
      },
    }

    this.hooks = {
      'offline:start:init': this.start.bind(this),
      'offline:start': this._startWithExplicitEnd.bind(this),
      'offline:start:end': this.end.bind(this),
    }
  }

  _printBlankLine() {
    if (process.env.NODE_ENV !== 'test') {
      console.log()
    }
  }

  // Entry point for the plugin (sls offline) when running 'sls offline start'
  async start() {
    // check if update is available
    updateNotifier({ pkg }).notify()

    this._verifyServerlessVersionCompatibility()

    // Some users would like to know their environment outside of the handler
    process.env.IS_OFFLINE = true

    this.mergeOptions()

    // TODO FIXME uncomment condition below
    // we can't do this just yet, because we always create endpoints for
    // lambda Invoke endpoints. we could potentially add a flag (not everyone
    // uses lambda invoke) and only add lambda invoke routes if flag is set
    //
    // if (hasHttpEvent(this._service.functions)) {
    await this._createApiGateway()
    await this._apiGateway.start()
    // }

    if (hasWebsocketEvent(this._service.functions)) {
      await this._createApiGatewayWebSocket()
      await this._apiGatewayWebSocket.start()
    }

    this.setupEvents()

    if (process.env.NODE_ENV !== 'test') {
      await this._listenForTermination()
    }
  }

  /**
   * Entry point for the plugin (sls offline) when running 'sls offline'
   * The call to this.end() would terminate the process before 'offline:start:end' could be consumed
   * by downstream plugins. When running sls offline that can be expected, but docs say that
   * 'sls offline start' will provide the init and end hooks for other plugins to consume
   * */
  async _startWithExplicitEnd() {
    await this.start()
    this.end()
  }

  async _listenForTermination() {
    const command = await new Promise((resolve) => {
      process
        // SIGINT will be usually sent when user presses ctrl+c
        .on('SIGINT', () => resolve('SIGINT'))
        // SIGTERM is a default termination signal in many cases,
        // for example when "killing" a subprocess spawned in node
        // with child_process methods
        .on('SIGTERM', () => resolve('SIGTERM'))
    })

    serverlessLog(`Got ${command} signal. Offline Halting...`)
  }

  async _createApiGateway() {
    // eslint-disable-next-line global-require
    const ApiGateway = require('./ApiGateway.js')

    this._apiGateway = new ApiGateway(
      this._service,
      this._options,
      this._env,
      this.velocityContextOptions,
    )

    await this._apiGateway.registerPlugins()
    this._apiGateway.createResourceRoutes() // HTTP Proxy defined in Resource
    this._apiGateway.create404Route() // Not found handling
  }

  async _createApiGatewayWebSocket() {
    // eslint-disable-next-line global-require
    const ApiGatewayWebSocket = require('./ApiGatewayWebSocket.js')

    this._apiGatewayWebSocket = new ApiGatewayWebSocket(
      this._service,
      this._options,
      this._env,
    )

    await this._apiGatewayWebSocket.registerPlugins()
    await this._apiGatewayWebSocket.createServer()
  }

  mergeOptions() {
    // In the constructor, stage and regions are set to undefined
    if (this._options.region === undefined) delete this._options.region
    if (this._options.stage === undefined) delete this._options.stage

    // TODO FIXME remove, leftover from default options
    const defaultsTEMP = {
      region: this._provider.region,
      stage: this._provider.stage,
    }

    // custom options
    const { [CUSTOM_OPTION]: customOptions } = this._service.custom || {}

    // merge options
    // order of Precedence: command line options, custom options, defaults.
    this._options = {
      ...defaults,
      ...defaultsTEMP, // TODO FIXME, see above
      ...customOptions,
      ...this._options,
    }

    // Prefix must start and end with '/'
    if (!this._options.prefix.startsWith('/')) {
      this._options.prefix = `/${this._options.prefix}`
    }
    if (!this._options.prefix.endsWith('/')) this._options.prefix += '/'

    this.velocityContextOptions = {
      stage: this._options.stage,
      stageVariables: {}, // this._service.environment.stages[this._options.stage].vars,
    }

    // Parse CORS options
    this._options.corsAllowHeaders = this._options.corsAllowHeaders
      .replace(/\s/g, '')
      .split(',')
    this._options.corsAllowOrigin = this._options.corsAllowOrigin
      .replace(/\s/g, '')
      .split(',')
    this._options.corsExposedHeaders = this._options.corsExposedHeaders
      .replace(/\s/g, '')
      .split(',')

    if (this._options.corsDisallowCredentials) {
      this._options.corsAllowCredentials = false
    }

    this._options.corsConfig = {
      credentials: this._options.corsAllowCredentials,
      exposedHeaders: this._options.corsExposedHeaders,
      headers: this._options.corsAllowHeaders,
      origin: this._options.corsAllowOrigin,
    }

    this._options.cacheInvalidationRegex = new RegExp(
      this._options.cacheInvalidationRegex,
    )

    serverlessLog(
      `Starting Offline: ${this._options.stage}/${this._options.region}.`,
    )
    debugLog('options:', this._options)
  }

  async end() {
    serverlessLog('Halting offline server')
    functionCacheCleanup()
    await this._apiGateway.stop(SERVER_SHUTDOWN_TIMEOUT)

    if (process.env.NODE_ENV !== 'test') {
      process.exit(0)
    }
  }

  setupEvents() {
    // for simple API Key authentication model
    if (this._provider.apiKeys) {
      serverlessLog(`Key with token: ${this._options.apiKey}`)

      if (this._options.noAuth) {
        serverlessLog(
          'Authorizers are turned off. You do not need to use x-api-key header.',
        )
      } else {
        serverlessLog('Remember to use x-api-key on the request headers')
      }
    }

    const { serverlessPath, servicePath } = this._serverless.config

    Object.entries(this._service.functions).forEach(
      ([functionName, functionObj]) => {
        // TODO re-activate?
        // serverlessLog(`Routes for ${functionName}:`)

        // TODO `fun.name` is not set in the jest test run
        // possible serverless BUG?
        if (process.env.NODE_ENV !== 'test') {
          this._apiGateway.createLambdaInvokeRoutes(
            functionName,
            functionObj,
            servicePath,
            serverlessPath,
          )
        }

        functionObj.events.forEach((event) => {
          const { http, websocket } = event

          if (http) {
            this._apiGateway.createRoutes(
              functionName,
              functionObj,
              event,
              servicePath,
              serverlessPath,
            )
          }

          if (websocket) {
            this._apiGatewayWebSocket.createWsAction(
              functionName,
              functionObj,
              event,
              servicePath,
              serverlessPath,
            )
          }
        })
      },
    )
  }

  // TEMP FIXME quick fix to expose gateway server for testing, look for better solution
  getApiGatewayServer() {
    return this._apiGateway.getServer()
  }

  // TODO: missing tests
  _verifyServerlessVersionCompatibility() {
    const { version: currentVersion } = this._serverless
    const { serverless: requiredVersion } = pkg.peerDependencies

    const versionIsSatisfied = satisfiesVersionRange(
      requiredVersion,
      currentVersion,
    )

    if (!versionIsSatisfied) {
      serverlessLog(
        `"Serverless-Offline" requires "Serverless" version ${requiredVersion} but found version ${currentVersion}.
         Be aware that functionality might be limited or has serious bugs.
         To avoid any issues update "Serverless" to a later version.
        `,
        'serverless-offline',
        { color: 'red' },
      )
    }
  }
}
