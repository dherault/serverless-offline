import updateNotifier from 'update-notifier'
import debugLog from './debugLog'
import serverlessLog, { logWarning, setLog } from './serverlessLog'
import { createDefaultApiKey, satisfiesVersionRange } from './utils/index'
import {
  CUSTOM_OPTION,
  defaults,
  options as commandOptions,
  SERVER_SHUTDOWN_TIMEOUT,
} from './config/index'
// @ts-ignore
import pkg from '../package.json'
import Serverless from 'serverless'
import Plugin from 'serverless/classes/Plugin'
import Lambda from './lambda/index'
import Http from './events/http/index'
import Schedule from './events/schedule/index'
import WebSocket from './events/websocket/index'

export default class ServerlessOffline implements Plugin {
  private _http: Http
  private _schedule: Schedule
  private _webSocket: WebSocket
  private _lambda: Lambda

  private readonly _config: any
  private _options: any
  private readonly _provider: any
  private readonly _service: any
  private readonly _version: string

  commands: Plugin.Commands
  hooks: Plugin.Hooks

  constructor(serverless: Serverless, options) {
    this._http = null
    this._schedule = null
    this._webSocket = null
    this._lambda = null

    this._config = serverless.config
    this._options = options
    this._provider = serverless.service.provider
    this._service = serverless.service
    this._version = serverless.version

    // @ts-ignore
    setLog((...args) => serverless.cli.log(...args))

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

  private _printBlankLine() {
    if (process.env.NODE_ENV !== 'test') {
      console.log()
    }
  }

  // Entry point for the plugin (sls offline) when running 'sls offline start'
  async start() {
    // check if update is available
    updateNotifier({ pkg }).notify()

    this._verifyServerlessVersionCompatibility()

    this.mergeOptions()

    const {
      httpEvents,
      lambdas,
      scheduleEvents,
      webSocketEvents,
    } = this._getEvents()

    // if (lambdas.length > 0) {
    await this._createLambda(lambdas)
    // }

    const eventModules = []

    if (httpEvents.length > 0) {
      eventModules.push(this._createHttp(httpEvents))
    }

    if (scheduleEvents.length > 0) {
      eventModules.push(this._createSchedule(scheduleEvents))
    }

    if (webSocketEvents.length > 0) {
      eventModules.push(this._createWebSocket(webSocketEvents))
    }

    await Promise.all(eventModules)

    if (process.env.NODE_ENV !== 'test') {
      await this._listenForTermination()
    }
  }

  async end(skipExit?: boolean) {
    // TEMP FIXME
    if (process.env.NODE_ENV === 'test' && skipExit === undefined) {
      return
    }

    serverlessLog('Halting offline server')

    const eventModules = []

    if (this._lambda) {
      eventModules.push(this._lambda.cleanup())
      eventModules.push(this._lambda.stop(SERVER_SHUTDOWN_TIMEOUT))
    }

    if (this._http) {
      eventModules.push(this._http.stop(SERVER_SHUTDOWN_TIMEOUT))
    }

    // if (this._schedule) {
    //   eventModules.push(this._schedule.stop())
    // }

    if (this._webSocket) {
      eventModules.push(this._webSocket.stop(SERVER_SHUTDOWN_TIMEOUT))
    }

    await Promise.all(eventModules)

    if (!skipExit) {
      process.exit(0)
    }
  }

  /**
   * Entry point for the plugin (sls offline) when running 'sls offline'
   * The call to this.end() would terminate the process before 'offline:start:end' could be consumed
   * by downstream plugins. When running sls offline that can be expected, but docs say that
   * 'sls offline start' will provide the init and end hooks for other plugins to consume
   * */
  private async _startWithExplicitEnd() {
    await this.start()
    this.end()
  }

  private async _listenForTermination() {
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

  // TODO FIXME use "private" access modifier
  async _createLambda(lambdas, skipStart) {
    const { default: Lambda } = await import('./lambda/index')

    this._lambda = new Lambda(this._provider, this._options, this._config)

    lambdas.forEach(({ functionKey, functionDefinition }) => {
      this._lambda.add(functionKey, functionDefinition)
    })

    if (!skipStart) {
      await this._lambda.start()
    }
  }

  // TODO FIXME use "private" access modifier
  async _createHttp(events, skipStart?: boolean) {
    const { default: Http } = await import('./events/http/index')

    this._http = new Http(
      this._service,
      this._options,
      this._config,
      this._lambda,
    )

    await this._http.registerPlugins()

    events.forEach(({ functionKey, functionDefinition, http }) => {
      this._http.createEvent(functionKey, functionDefinition, http)
    })

    // HTTP Proxy defined in Resource
    this._http.createResourceRoutes()

    // Not found handling
    // we have to create the 404 routes last, otherwise we could have
    // collisions with catch all routes, e.g. any (proxy+}
    this._http.create404Route()

    if (!skipStart) {
      await this._http.start()
    }
  }

  private async _createSchedule(events) {
    const { default: Schedule } = await import('./events/schedule/index')

    this._schedule = new Schedule(this._lambda)

    events.forEach(({ functionKey, schedule }) => {
      this._schedule.createEvent(functionKey, schedule)
    })
  }

  private async _createWebSocket(events) {
    const { default: WebSocket } = await import('./events/websocket/index')

    this._webSocket = new WebSocket(this._service, this._options, this._lambda)

    events.forEach(({ functionKey, functionDefinition, websocket }) => {
      this._webSocket.createEvent(functionKey, functionDefinition, websocket)
    })

    return this._webSocket.start()
  }

  mergeOptions() {
    // custom options
    const { [CUSTOM_OPTION]: customOptions } = this._service.custom || {}

    // merge options
    // order of Precedence: command line options, custom options, defaults.
    this._options = {
      apiKey: createDefaultApiKey(),
      ...defaults,
      ...customOptions,
      ...this._options,
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

    serverlessLog(
      `Starting Offline: ${this._provider.stage}/${this._provider.region}.`,
    )
    debugLog('options:', this._options)
  }

  // TODO FIXME use "private" access modifier
  _getEvents() {
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

    const httpEvents = []
    const lambdas = []
    const scheduleEvents = []
    const webSocketEvents = []

    const functionKeys = this._service.getAllFunctions()

    functionKeys.forEach((functionKey) => {
      // TODO re-activate?
      // serverlessLog(`Routes for ${functionKey}:`)
      const functionDefinition = this._service.getFunction(functionKey)

      lambdas.push({ functionKey, functionDefinition })

      const events = this._service.getAllEventsInFunction(functionKey)

      events.forEach((event) => {
        const { http, schedule, websocket } = event

        if (http) {
          httpEvents.push({ functionKey, functionDefinition, http })
        }

        if (schedule) {
          scheduleEvents.push({ functionKey, schedule })
        }

        if (websocket) {
          webSocketEvents.push({ functionKey, functionDefinition, websocket })
        }
      })
    })

    return {
      httpEvents,
      lambdas,
      scheduleEvents,
      webSocketEvents,
    }
  }

  // TEMP FIXME quick fix to expose gateway server for testing, look for better solution
  getApiGatewayServer() {
    return this._http.getServer()
  }

  // TODO: missing tests
  private _verifyServerlessVersionCompatibility() {
    const currentVersion = this._version
    const requiredVersionRange = pkg.peerDependencies.serverless

    const versionIsSatisfied = satisfiesVersionRange(
      currentVersion,
      requiredVersionRange,
    )

    if (!versionIsSatisfied) {
      logWarning(
        `serverless-offline requires serverless version ${requiredVersionRange} but found version ${currentVersion}.
         Be aware that functionality might be limited or contains bugs.
         To avoid any issues update serverless to a later version.
        `,
      )
    }
  }
}
