import process, { env, exit } from 'node:process'
import { log } from '@serverless/utils/log.js'
import chalk from 'chalk'
import {
  commandOptions,
  CUSTOM_OPTION,
  defaultOptions,
  SERVER_SHUTDOWN_TIMEOUT,
} from './config/index.js'
export default class ServerlessOffline {
  #cliOptions = null
  #http = null
  #lambda = null
  #options = null
  #schedule = null
  #serverless = null
  #webSocket = null
  constructor(serverless, cliOptions) {
    this.#cliOptions = cliOptions
    this.#serverless = serverless
    this.commands = {
      offline: {
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
    this.hooks = {
      'offline:functionsUpdated:cleanup': this.#cleanupFunctions.bind(this),
      'offline:start': this.#startWithExplicitEnd.bind(this),
      'offline:start:end': this.end.bind(this),
      'offline:start:init': this.start.bind(this),
      'offline:start:ready': this.#ready.bind(this),
    }
  }
  async start() {
    env.IS_OFFLINE = true
    this.#mergeOptions()
    const { httpEvents, lambdas, scheduleEvents, webSocketEvents } =
      this.#getEvents()
    await this.#createLambda(lambdas)
    const eventModules = []
    if (httpEvents.length > 0) {
      eventModules.push(this.#createHttp(httpEvents))
    }
    if (!this.#options.disableScheduledEvents && scheduleEvents.length > 0) {
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
      eventModules.push(this.#lambda.cleanup())
      eventModules.push(this.#lambda.stop(SERVER_SHUTDOWN_TIMEOUT))
    }
    if (this.#http) {
      eventModules.push(this.#http.stop(SERVER_SHUTDOWN_TIMEOUT))
    }
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
  async #startWithExplicitEnd() {
    await this.start()
    await this.#ready()
    this.end()
  }
  async #listenForTermination() {
    const command = await new Promise((resolve) => {
      process
        .on('SIGINT', () => resolve('SIGINT'))
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
    await this.#http.registerPlugins()
    this.#http.create(events)
    this.#http.createResourceRoutes()
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
    this.#webSocket.create(events)
    return this.#webSocket.start()
  }
  #mergeOptions() {
    const {
      service: { custom = {}, provider },
    } = this.#serverless
    const customOptions = custom[CUSTOM_OPTION]
    this.#options = {
      ...defaultOptions,
      ...customOptions,
      ...this.#cliOptions,
    }
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
    log.notice()
    log.notice(
      `Starting Offline at stage ${provider.stage} ${chalk.gray(
        `(${provider.region})`,
      )}`,
    )
    log.notice()
    log.debug('options:', this.#options)
  }
  #getEvents() {
    const { service } = this.#serverless
    const httpEvents = []
    const lambdas = []
    const scheduleEvents = []
    const webSocketEvents = []
    const functionKeys = service.getAllFunctions()
    let hasPrivateHttpEvent = false
    functionKeys.forEach((functionKey) => {
      const functionDefinition = service.getFunction(functionKey)
      lambdas.push({
        functionDefinition,
        functionKey,
      })
      const events = service.getAllEventsInFunction(functionKey) || []
      events.forEach((event) => {
        const { http, httpApi, schedule, websocket } = event
        if ((http || httpApi) && functionDefinition.handler) {
          const httpEvent = {
            functionKey,
            handler: functionDefinition.handler,
            http: http || httpApi,
          }
          if (httpApi) {
            if (typeof httpEvent.http === 'string') {
              httpEvent.http = {
                routeKey: httpEvent.http === '*' ? '$default' : httpEvent.http,
              }
            } else if (typeof httpEvent.http === 'object') {
              if (!httpEvent.http.method) {
                log.warning(
                  `Event definition is missing a method for function "${functionKey}"`,
                )
                httpEvent.http.method = ''
              }
              if (
                httpEvent.http.method === '*' &&
                httpEvent.http.path === '*'
              ) {
                httpEvent.http.routeKey = '$default'
              } else {
                const resolvedMethod =
                  httpEvent.http.method === '*'
                    ? 'ANY'
                    : httpEvent.http.method.toUpperCase()
                httpEvent.http.routeKey = `${resolvedMethod} ${httpEvent.http.path}`
              }
              delete httpEvent.http.method
              delete httpEvent.http.path
            } else {
              log.warning(
                `Event definition must be a string or object but received ${typeof httpEvent.http} for function "${functionKey}"`,
              )
              httpEvent.http.routeKey = ''
            }
            httpEvent.http.isHttpApi = true
            if (
              functionDefinition.httpApi &&
              functionDefinition.httpApi.payload
            ) {
              httpEvent.http.payload = functionDefinition.httpApi.payload
            } else {
              httpEvent.http.payload =
                service.provider.httpApi && service.provider.httpApi.payload
                  ? service.provider.httpApi.payload
                  : '2.0'
            }
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
      })
    })
    if (hasPrivateHttpEvent) {
      log.notice(`Key with token: ${this.#options.apiKey}`)
      if (this.#options.noAuth) {
        log.notice(
          'Authorizers are turned off. You do not need to use x-api-key header.',
        )
      } else {
        log.notice('Remember to use x-api-key on the request headers')
      }
    }
    return {
      httpEvents,
      lambdas,
      scheduleEvents,
      webSocketEvents,
    }
  }
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
