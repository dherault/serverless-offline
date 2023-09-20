import process, { exit } from 'node:process'
import { log } from '@serverless/utils/log.js'
import {
  commandOptions,
  CUSTOM_OPTION,
  defaultOptions,
  SERVER_SHUTDOWN_TIMEOUT,
} from './config/index.js'
import { gray } from './config/colors.js'

export default class ServerlessOffline {
  #alb = null

  #cliOptions = null

  #http = null

  #lambda = null

  #options = null

  #schedule = null

  #serverless = null

  #webSocket = null

  commands = {
    offline: {
      // add start nested options
      commands: {
        functionsUpdated: {
          lifecycleEvents: ['cleanup'],
          type: 'entrypoint',
        },
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

  hooks = {
    'offline:functionsUpdated:cleanup': this.#cleanupFunctions.bind(this),
    'offline:start': this.#startWithExplicitEnd.bind(this),
    'offline:start:end': this.end.bind(this),
    'offline:start:init': this.start.bind(this),
    'offline:start:ready': this.#ready.bind(this),
  }

  constructor(serverless, cliOptions) {
    this.#cliOptions = cliOptions
    this.#serverless = serverless
  }

  // Entry point for the plugin (sls offline) when running 'sls offline start'
  async start() {
    this.#mergeOptions()

    const {
      albEvents,
      httpEvents,
      httpApiEvents,
      lambdas,
      scheduleEvents,
      webSocketEvents,
    } = this.#getEvents()

    if (lambdas.length > 0) {
      await this.#createLambda(lambdas)
    }

    const eventModules = []

    if (albEvents.length > 0) {
      eventModules.push(this.#createAlb(albEvents))
    }

    if (httpApiEvents.length > 0 || httpEvents.length > 0) {
      eventModules.push(this.#createHttp([...httpApiEvents, ...httpEvents]))
    }

    if (scheduleEvents.length > 0) {
      eventModules.push(this.#createSchedule(scheduleEvents))
    }

    if (webSocketEvents.length > 0) {
      eventModules.push(this.#createWebSocket(webSocketEvents))
    }

    await Promise.all(eventModules)
  }

  async #ready() {
    await this.#listenForTermination()
  }

  async end(skipExit) {
    log.info('Halting offline server')

    const eventModules = []

    if (this.#lambda) {
      eventModules.push(
        this.#lambda.cleanup(),
        this.#lambda.stop(SERVER_SHUTDOWN_TIMEOUT),
      )
    }

    if (this.#alb) {
      eventModules.push(this.#alb.stop(SERVER_SHUTDOWN_TIMEOUT))
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

    await Promise.all(eventModules)

    if (!skipExit) {
      exit(0)
    }
  }

  async #cleanupFunctions() {
    if (this.#lambda) {
      log.debug('Forcing cleanup of Lambda functions')
      await this.#lambda.cleanup()
    }
  }

  /**
   * Entry point for the plugin (serverless offline) when running 'serverless offline'
   * The call to this.end() would terminate the process before 'offline:start:end' could be consumed
   * by downstream plugins. When running serverless offline that can be expected, but docs say that
   * 'serverless offline start' will provide the init and end hooks for other plugins to consume
   * */
  async #startWithExplicitEnd() {
    await this.start()
    await this.#ready()
    await this.end()
  }

  async #listenForTermination() {
    const command = await new Promise((resolve) => {
      process
        // SIGINT will be usually sent when user presses ctrl+c
        .on('SIGINT', () => resolve('SIGINT'))
        // SIGTERM is a default termination signal in many cases,
        // for example when "killing" a subprocess spawned in node
        // with child_process methods
        .on('SIGTERM', () => resolve('SIGTERM'))
    })

    log.info(`Got ${command} signal. Offline Halting...`)
  }

  async #createLambda(lambdas, skipStart) {
    const { default: Lambda } = await import('./lambda/index.js')

    this.#lambda = new Lambda(this.#serverless, this.#options)

    this.#lambda.create(lambdas)

    if (!skipStart) {
      await this.#lambda.start()
    }
  }

  async #createHttp(events, skipStart) {
    const { default: Http } = await import('./events/http/index.js')

    this.#http = new Http(this.#serverless, this.#options, this.#lambda)

    await this.#http.createServer()

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

  async #createSchedule(events) {
    const { default: Schedule } = await import('./events/schedule/index.js')

    this.#schedule = new Schedule(
      this.#lambda,
      this.#serverless.service.provider.region,
    )

    this.#schedule.create(events)
  }

  async #createWebSocket(events) {
    const { default: WebSocket } = await import('./events/websocket/index.js')

    this.#webSocket = new WebSocket(
      this.#serverless,
      this.#options,
      this.#lambda,
    )

    await this.#webSocket.createServer()

    this.#webSocket.create(events)

    await this.#webSocket.start()
  }

  async #createAlb(events, skipStart) {
    const { default: Alb } = await import('./events/alb/index.js')

    this.#alb = new Alb(this.#serverless, this.#options, this.#lambda)

    await this.#alb.createServer()

    this.#alb.create(events)

    if (!skipStart) {
      await this.#alb.start()
    }
  }

  #mergeOptions() {
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
      .replaceAll(' ', '')
      .split(',')
    this.#options.corsAllowOrigin = this.#options.corsAllowOrigin
      .replaceAll(' ', '')
      .split(',')
    this.#options.corsExposedHeaders = this.#options.corsExposedHeaders
      .replaceAll(' ', '')
      .split(',')

    this.#options.corsConfig = {
      credentials: !this.#options.corsDisallowCredentials,
      exposedHeaders: this.#options.corsExposedHeaders,
      headers: this.#options.corsAllowHeaders,
      origin: this.#options.corsAllowOrigin,
    }

    log.notice()
    log.notice(
      `Starting Offline at stage ${
        this.#options.stage || provider.stage
      } ${gray(`(${this.#options.region || provider.region})`)}`,
    )
    log.notice()
    log.debug('options:', this.#options)
  }

  #getEvents() {
    const { service } = this.#serverless

    const albEvents = []
    const httpEvents = []
    const httpApiEvents = []
    const lambdas = []
    const scheduleEvents = []
    const webSocketEvents = []

    const functionKeys = service.getAllFunctions()

    functionKeys.forEach((functionKey) => {
      const functionDefinition = service.getFunction(functionKey)

      lambdas.push({
        functionDefinition,
        functionKey,
      })

      const events = service.getAllEventsInFunction(functionKey) ?? []

      events.forEach((event) => {
        const { alb, http, httpApi, schedule, websocket } = event

        if (alb) {
          albEvents.push({
            alb,
            functionKey,
            handler: functionDefinition.handler,
          })
        }

        if (http && functionDefinition.handler) {
          const httpEvent = {
            functionKey,
            handler: functionDefinition.handler,
            http,
          }

          httpEvents.push(httpEvent)
        }

        if (httpApi && functionDefinition.handler) {
          const httpApiEvent = {
            functionKey,
            handler: functionDefinition.handler,
            http: httpApi,
          }

          // Ensure definitions for 'httpApi' events are objects so that they can be marked
          // with an 'isHttpApi' property (they are handled differently to 'http' events)
          if (typeof httpApiEvent.http === 'string') {
            httpApiEvent.http = {
              routeKey:
                httpApiEvent.http === '*' ? '$default' : httpApiEvent.http,
            }
          } else if (typeof httpApiEvent.http === 'object') {
            if (!httpApiEvent.http.method) {
              log.warning(
                `Event definition is missing a method for function "${functionKey}"`,
              )
              httpApiEvent.http.method = ''
            }
            if (
              httpApiEvent.http.method === '*' &&
              httpApiEvent.http.path === '*'
            ) {
              httpApiEvent.http.routeKey = '$default'
            } else {
              const resolvedMethod =
                httpApiEvent.http.method === '*'
                  ? 'ANY'
                  : httpApiEvent.http.method.toUpperCase()
              httpApiEvent.http.routeKey = `${resolvedMethod} ${httpApiEvent.http.path}`
            }
            // Clear these properties to avoid confusion (they will be derived from the routeKey
            // when needed later)
            delete httpApiEvent.http.method
            delete httpApiEvent.http.path
          } else {
            log.warning(
              `Event definition must be a string or object but received ${typeof httpApiEvent.http} for function "${functionKey}"`,
            )
            httpApiEvent.http.routeKey = ''
          }

          httpApiEvent.http.isHttpApi = true

          if (
            functionDefinition.httpApi &&
            functionDefinition.httpApi.payload
          ) {
            httpApiEvent.http.payload = functionDefinition.httpApi.payload
          } else {
            httpApiEvent.http.payload =
              service.provider.httpApi && service.provider.httpApi.payload
                ? service.provider.httpApi.payload
                : '2.0'
          }

          httpApiEvents.push(httpApiEvent)
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
      })
    })

    return {
      albEvents,
      httpApiEvents,
      httpEvents,
      lambdas,
      scheduleEvents,
      webSocketEvents,
    }
  }

  // TODO FIXME
  // TEMP quick fix to expose for testing, look for better solution
  internals() {
    return {
      createHttp: (events, skipStart) => {
        return this.#createHttp(events, skipStart)
      },

      createLambda: (lambdas, skipStart) => {
        return this.#createLambda(lambdas, skipStart)
      },

      getApiGatewayServer: () => {
        return this.#http.getServer()
      },

      getEvents: () => {
        return this.#getEvents()
      },

      mergeOptions: () => {
        this.#mergeOptions()
      },
    }
  }
}
