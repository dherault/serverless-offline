import updateNotifier from 'update-notifier'
import debugLog from './debugLog.js'
import serverlessLog, { logWarning, setLog } from './serverlessLog.js'
import { satisfiesVersionRange } from './utils/index.js'
import {
  commandOptions,
  CUSTOM_OPTION,
  defaultOptions,
  SERVER_SHUTDOWN_TIMEOUT,
} from './config/index.js'
import pkg from '../package.json'

export default class ServerlessOffline {
  #cliOptions = null
  #http = null
  #options = null
  #schedule = null
  #webSocket = null
  #lambda = null
  #alb = null
  #serverless = null

  constructor(serverless, cliOptions) {
    this.#cliOptions = cliOptions
    this.#serverless = serverless

    setLog((...args) => serverless.cli.log(...args))

    this.commands = {
      offline: {
        // add start nested options
        commands: {
          start: {
            lifecycleEvents: ['init', 'ready', 'end'],
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
      'offline:start:ready': this.ready.bind(this),
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
    // Put here so available everywhere, not just in handlers
    process.env.IS_OFFLINE = true

    // check if update is available
    updateNotifier({ pkg }).notify()

    this._verifyServerlessVersionCompatibility()

    this._mergeOptions()

    const {
      httpEvents,
      lambdas,
      scheduleEvents,
      webSocketEvents,
      albEvents,
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

    if (albEvents.length > 0) {
      eventModules.push(this._createAlb(albEvents))
    }

    await Promise.all(eventModules)
  }

  async ready() {
    if (process.env.NODE_ENV !== 'test') {
      await this._listenForTermination()
    }
  }

  async end(skipExit) {
    // TEMP FIXME
    if (process.env.NODE_ENV === 'test' && skipExit === undefined) {
      return
    }

    serverlessLog('Halting offline server')

    const eventModules = []

    if (this.#lambda) {
      eventModules.push(this.#lambda.cleanup())
      eventModules.push(this.#lambda.stop(SERVER_SHUTDOWN_TIMEOUT))
    }

    if (this.#http) {
      eventModules.push(this.#http.stop(SERVER_SHUTDOWN_TIMEOUT))
    }

    // if (this.#schedule) {
    //   eventModules.push(this.#schedule.stop())
    // }

    if (this.#webSocket) {
      eventModules.push(this.#webSocket.stop(SERVER_SHUTDOWN_TIMEOUT))
    }

    if (this.#alb) {
      eventModules.push(this.#alb.stop(SERVER_SHUTDOWN_TIMEOUT))
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
  async _startWithExplicitEnd() {
    await this.start()
    await this.ready()
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

  async _createLambda(lambdas, skipStart) {
    const { default: Lambda } = await import('./lambda/index.js')

    this.#lambda = new Lambda(this.#serverless, this.#options)

    this.#lambda.create(lambdas)

    if (!skipStart) {
      await this.#lambda.start()
    }
  }

  async _createHttp(events, skipStart) {
    const { default: Http } = await import('./events/http/index.js')

    this.#http = new Http(this.#serverless, this.#options, this.#lambda)

    await this.#http.registerPlugins()

    this.#http.create(events)

    // HTTP Proxy defined in Resource
    this.#http.createResourceRoutes()

    // Not found handling
    // we have to create the 404 routes last, otherwise we could have
    // collisions with catch all routes, e.g. any (proxy+}
    this.#http.create404Route()

    if (!skipStart) {
      await this.#http.start()
    }
  }

  async _createAlb(events, skipStart) {
    const { default: Alb } = await import('./events/alb/index.js')

    this.#alb = new Alb(this.#serverless, this.#options, this.#lambda)

    this.#alb.create(events)

    if (!skipStart) {
      await this.#alb.start()
    }
  }

  async _createSchedule(events) {
    const { default: Schedule } = await import('./events/schedule/index.js')

    this.#schedule = new Schedule(
      this.#lambda,
      this.#serverless.service.provider.region,
    )

    this.#schedule.create(events)
  }

  async _createWebSocket(events) {
    const { default: WebSocket } = await import('./events/websocket/index.js')

    this.#webSocket = new WebSocket(
      this.#serverless,
      this.#options,
      this.#lambda,
    )

    this.#webSocket.create(events)

    return this.#webSocket.start()
  }

  _mergeOptions() {
    const {
      service: { custom = {}, provider },
    } = this.#serverless

    const customOptions = custom[CUSTOM_OPTION]

    // merge options
    // order of Precedence: command line options, custom options, defaults.
    this.#options = {
      ...defaultOptions,
      ...customOptions,
      ...this.#cliOptions,
    }

    // Parse CORS options
    this.#options.corsAllowHeaders = this.#options.corsAllowHeaders
      .replace(/\s/g, '')
      .split(',')
    this.#options.corsAllowOrigin = this.#options.corsAllowOrigin
      .replace(/\s/g, '')
      .split(',')
    this.#options.corsExposedHeaders = this.#options.corsExposedHeaders
      .replace(/\s/g, '')
      .split(',')

    if (this.#options.corsDisallowCredentials) {
      this.#options.corsAllowCredentials = false
    }

    this.#options.corsConfig = {
      credentials: this.#options.corsAllowCredentials,
      exposedHeaders: this.#options.corsExposedHeaders,
      headers: this.#options.corsAllowHeaders,
      origin: this.#options.corsAllowOrigin,
    }

    serverlessLog(`Starting Offline: ${provider.stage}/${provider.region}.`)
    debugLog('options:', this.#options)
  }

  _getEvents() {
    const { service } = this.#serverless

    const httpEvents = []
    const lambdas = []
    const scheduleEvents = []
    const webSocketEvents = []
    const albEvents = []

    const functionKeys = service.getAllFunctions()

    let hasPrivateHttpEvent = false

    functionKeys.forEach((functionKey) => {
      const functionDefinition = service.getFunction(functionKey)

      lambdas.push({ functionKey, functionDefinition })

      const events = service.getAllEventsInFunction(functionKey) || []

      events.forEach((event) => {
        const { http, httpApi, schedule, websocket, alb } = event

        if ((http || httpApi) && functionDefinition.handler) {
          const httpEvent = {
            functionKey,
            handler: functionDefinition.handler,
            http: http || httpApi,
          }

          if (httpApi) {
            // Ensure definitions for 'httpApi' events are objects so that they can be marked
            // with an 'isHttpApi' property (they are handled differently to 'http' events)
            if (typeof httpEvent.http === 'string') {
              httpEvent.http = {
                routeKey: httpEvent.http === '*' ? '$default' : httpEvent.http,
              }
            } else if (typeof httpEvent.http === 'object') {
              if (!httpEvent.http.method) {
                logWarning(
                  `Event definition is missing a method for function "${functionKey}"`,
                )
                httpEvent.http.method = ''
              }
              const resolvedMethod =
                httpEvent.http.method === '*'
                  ? 'ANY'
                  : httpEvent.http.method.toUpperCase()
              httpEvent.http.routeKey = `${resolvedMethod} ${httpEvent.http.path}`
              // Clear these properties to avoid confusion (they will be derived from the routeKey
              // when needed later)
              delete httpEvent.http.method
              delete httpEvent.http.path
            } else {
              logWarning(
                `Event definition must be a string or object but received ${typeof httpEvent.http} for function "${functionKey}"`,
              )
              httpEvent.http.routeKey = ''
            }

            httpEvent.http.isHttpApi = true
            httpEvent.http.payload =
              service.provider.httpApi && service.provider.httpApi.payload
                ? service.provider.httpApi.payload
                : '2.0'
          }

          if (http && http.private) {
            hasPrivateHttpEvent = true
          }

          httpEvents.push(httpEvent)
        }

        if (schedule) {
          scheduleEvents.push({
            functionKey,
            schedule,
          })
        }

        if (websocket) {
          webSocketEvents.push({
            functionKey,
            websocket,
          })
        }

        if (alb) {
          albEvents.push({
            functionKey,
            handler: functionDefinition.handler,
            alb,
          })
        }
      })
    })

    // for simple API Key authentication model
    if (hasPrivateHttpEvent) {
      serverlessLog(`Key with token: ${this.#options.apiKey}`)

      if (this.#options.noAuth) {
        serverlessLog(
          'Authorizers are turned off. You do not need to use x-api-key header.',
        )
      } else {
        serverlessLog('Remember to use x-api-key on the request headers')
      }
    }

    return {
      httpEvents,
      lambdas,
      scheduleEvents,
      webSocketEvents,
      albEvents,
    }
  }

  // TEMP FIXME quick fix to expose gateway server for testing, look for better solution
  getApiGatewayServer() {
    return this.#http.getServer()
  }

  // TODO: missing tests
  _verifyServerlessVersionCompatibility() {
    const currentVersion = this.#serverless.version
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
