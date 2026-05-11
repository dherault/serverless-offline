import { Buffer } from "node:buffer"
import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { join, resolve } from "node:path"
import { exit } from "node:process"
import h2o2 from "@hapi/h2o2"
import { Server } from "@hapi/hapi"
import { log } from "../../utils/log.js"
import authFunctionNameExtractor from "../authFunctionNameExtractor.js"
import authJWTSettingsExtractor from "./authJWTSettingsExtractor.js"
import createAuthScheme from "./createAuthScheme.js"
import createJWTAuthScheme from "./createJWTAuthScheme.js"
import Endpoint from "./Endpoint.js"
import {
  LambdaIntegrationEvent,
  LambdaProxyIntegrationEvent,
  renderVelocityTemplateObject,
  VelocityContext,
} from "./lambda-events/index.js"
import LambdaProxyIntegrationEventV2 from "./lambda-events/LambdaProxyIntegrationEventV2.js"
import parseResources from "./parseResources.js"
import payloadSchemaValidator from "./payloadSchemaValidator.js"
import logRoutes from "../../utils/logRoutes.js"
import {
  createApiKey,
  detectEncoding,
  generateHapiPath,
  getApiKeysValues,
  getHttpApiCorsConfig,
  jsonPath,
  splitHandlerPathAndName,
} from "../../utils/index.js"

const { parse, stringify } = JSON
const { assign, entries, keys } = Object

export default class HttpServer {
  #apiKeysValues = null

  #hasPrivateHttpEvent = false

  #lambda = null

  #options = null

  #server = null

  #serverless = null

  #terminalInfo = []

  constructor(serverless, options, lambda) {
    this.#lambda = lambda
    this.#options = options
    this.#serverless = serverless
  }

  async #loadCerts(httpsProtocol) {
    const [cert, key] = await Promise.all([
      readFile(resolve(httpsProtocol, "cert.pem"), "utf8"),
      readFile(resolve(httpsProtocol, "key.pem"), "utf8"),
    ])

    return {
      cert,
      key,
    }
  }

  async createServer() {
    const { enforceSecureCookies, host, httpPort, httpsProtocol } =
      this.#options

    const serverOptions = {
      host,
      port: httpPort,
      router: {
        stripTrailingSlash: true,
      },
      state: enforceSecureCookies
        ? {
            isHttpOnly: true,
            isSameSite: false,
            isSecure: true,
          }
        : {
            isHttpOnly: false,
            isSameSite: false,
            isSecure: false,
          },
      // https support
      ...(httpsProtocol != null && {
        tls: await this.#loadCerts(httpsProtocol),
      }),
    }

    // Hapijs server creation
    this.#server = new Server(serverOptions)

    try {
      await this.#server.register([h2o2])
    } catch (err) {
      log.error(err)
    }

    // Enable CORS preflight response
    this.#server.ext("onPreResponse", (request, h) => {
      if (request.headers.origin) {
        const response = request.response.isBoom
          ? request.response.output
          : request.response

        const explicitlySetHeaders = {
          ...response.headers,
        }

        if (
          this.#serverless.service.provider.httpApi &&
          this.#serverless.service.provider.httpApi.cors
        ) {
          const httpApiCors = getHttpApiCorsConfig(
            this.#serverless.service.provider.httpApi.cors,
            this,
          )

          if (request.method === "options") {
            response.statusCode = 204
            const allowAllOrigins =
              httpApiCors.allowedOrigins.length === 1 &&
              httpApiCors.allowedOrigins[0] === "*"
            if (
              !allowAllOrigins &&
              !httpApiCors.allowedOrigins.includes(request.headers.origin)
            ) {
              return h.continue
            }
          }

          response.headers["access-control-allow-origin"] =
            request.headers.origin
          if (httpApiCors.allowCredentials) {
            response.headers["access-control-allow-credentials"] = "true"
          }
          if (httpApiCors.maxAge) {
            response.headers["access-control-max-age"] = httpApiCors.maxAge
          }
          if (httpApiCors.exposedResponseHeaders) {
            response.headers["access-control-expose-headers"] =
              httpApiCors.exposedResponseHeaders.join(",")
          }
          if (httpApiCors.allowedMethods) {
            response.headers["access-control-allow-methods"] =
              httpApiCors.allowedMethods.join(",")
          }
          if (httpApiCors.allowedHeaders) {
            response.headers["access-control-allow-headers"] =
              httpApiCors.allowedHeaders.join(",")
          }
        } else {
          response.headers["access-control-allow-origin"] =
            request.headers.origin
          response.headers["access-control-allow-credentials"] = "true"

          if (request.method === "options") {
            response.statusCode = 200

            response.headers["access-control-expose-headers"] =
              request.headers["access-control-expose-headers"] ||
              "content-type, content-length, etag"
            response.headers["access-control-max-age"] = 60 * 10

            if (request.headers["access-control-request-headers"]) {
              response.headers["access-control-allow-headers"] =
                request.headers["access-control-request-headers"]
            }

            if (request.headers["access-control-request-method"]) {
              response.headers["access-control-allow-methods"] =
                request.headers["access-control-request-method"]
            }
          }

          // Override default headers with headers that have been explicitly set
          entries(explicitlySetHeaders).forEach(([key, value]) => {
            if (value) {
              response.headers[key] = value
            }
          })
        }
      }
      return h.continue
    })
  }

  async start() {
    const { host, httpPort, httpsProtocol } = this.#options

    try {
      await this.#server.start()
    } catch (err) {
      log.error(
        `Unexpected error while starting serverless-offline server on port ${httpPort}:`,
        err,
      )
      exit(1)
    }

    // TODO move the following block
    const server = `${httpsProtocol ? "https" : "http"}://${host}:${httpPort}`

    log.notice(`Server ready: ${server} 🚀`)
  }

  // stops the server
  stop(timeout) {
    return this.#server.stop({
      timeout,
    })
  }

  #logPluginIssue() {
    log.notice(
      "If you think this is an issue with the plugin please submit it, thanks!\nhttps://github.com/dherault/serverless-offline/issues",
    )
    log.notice()
  }

  #extractJWTAuthSettings(endpoint) {
    const result = authJWTSettingsExtractor(
      endpoint,
      this.#serverless.service.provider,
      this.#options.ignoreJWTSignature,
    )

    return result.unsupportedAuth ? null : result
  }

  #configureJWTAuthorization(endpoint, functionKey, method, path) {
    if (!endpoint.authorizer) {
      return null
    }

    // right now _configureJWTAuthorization only handles AWS HttpAPI Gateway JWT
    // authorizers that are defined in the serverless file
    if (
      this.#serverless.service.provider.name !== "aws" ||
      !endpoint.isHttpApi
    ) {
      return null
    }

    if (
      (endpoint.authorizer.name &&
        this.#serverless.service.provider?.httpApi?.authorizers?.[
          endpoint.authorizer.name
        ]?.type === "request") ||
      endpoint.authorizer.type === "request"
    ) {
      return null
    }

    const jwtSettings = this.#extractJWTAuthSettings(endpoint)
    if (!jwtSettings) {
      return null
    }

    log.notice(`Configuring JWT Authorization: ${method} ${path}`)

    // Create a unique scheme per endpoint
    // This allows the methodArn on the event property to be set appropriately
    const authKey = `${functionKey}-${jwtSettings.authorizerName}-${method}-${path}`
    const authSchemeName = `scheme-${authKey}`
    const authStrategyName = `strategy-${authKey}` // set strategy name for the route config

    log.debug(`Creating Authorization scheme for ${authKey}`)

    // Create the Auth Scheme for the endpoint
    const scheme = createJWTAuthScheme(jwtSettings)

    // Set the auth scheme and strategy on the server
    this.#server.auth.scheme(authSchemeName, scheme)
    this.#server.auth.strategy(authStrategyName, authSchemeName)

    return authStrategyName
  }

  #extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint)

    return result.unsupportedAuth ? null : result.authorizerName
  }

  #configureAuthorization(endpoint, functionKey, method, path) {
    if (!endpoint.authorizer) {
      return null
    }

    let authFunctionName = this.#extractAuthFunctionName(endpoint)

    if (!authFunctionName) {
      return null
    }

    log.notice(`Configuring Authorization: ${path} ${authFunctionName}`)

    const standardFunctionExists =
      this.#serverless.service.functions &&
      this.#serverless.service.functions[authFunctionName]
    const serverlessAuthorizerOptions =
      this.#serverless.service.provider.httpApi &&
      this.#serverless.service.provider.httpApi.authorizers &&
      this.#serverless.service.provider.httpApi.authorizers[authFunctionName]

    if (
      !standardFunctionExists &&
      endpoint.isHttpApi &&
      serverlessAuthorizerOptions &&
      serverlessAuthorizerOptions.functionName
    ) {
      log.notice(
        `Redirecting authorizer function: ${authFunctionName} to ${serverlessAuthorizerOptions.functionName}`,
      )
      authFunctionName = serverlessAuthorizerOptions.functionName
    }

    const authFunction = this.#serverless.service.getFunction(authFunctionName)

    if (!authFunction) {
      log.error(`Authorization function ${authFunctionName} does not exist`)
      return null
    }

    const authorizerOptions = {
      enableSimpleResponses:
        (endpoint.isHttpApi &&
          serverlessAuthorizerOptions?.enableSimpleResponses) ||
        false,
      identitySource: serverlessAuthorizerOptions?.identitySource,
      identityValidationExpression:
        serverlessAuthorizerOptions?.identityValidationExpression || "(.*)",
      payloadVersion: endpoint.isHttpApi
        ? serverlessAuthorizerOptions?.payloadVersion || "2.0"
        : "1.0",
      resultTtlInSeconds:
        serverlessAuthorizerOptions?.resultTtlInSeconds ?? "300",
      type: endpoint.isHttpApi ? serverlessAuthorizerOptions?.type : undefined,
    }

    if (
      authorizerOptions.enableSimpleResponses &&
      authorizerOptions.payloadVersion === "1.0"
    ) {
      log.error(
        `Cannot create Authorization function '${authFunctionName}' if payloadVersion is '1.0' and enableSimpleResponses is true`,
      )
      return null
    }

    if (typeof endpoint.authorizer !== "string") {
      assign(authorizerOptions, endpoint.authorizer)
    }
    authorizerOptions.name = authFunctionName

    if (
      !authorizerOptions.identitySource &&
      !(
        authorizerOptions.type === "request" &&
        authorizerOptions.resultTtlInSeconds === 0
      )
    ) {
      authorizerOptions.identitySource = "method.request.header.Authorization"
    }

    // Create a unique scheme per endpoint
    // This allows the methodArn on the event property to be set appropriately
    const authKey = `${functionKey}-${authFunctionName}-${method}-${path}`
    const authSchemeName = `scheme-${authKey}`
    const authStrategyName = `strategy-${authKey}` // set strategy name for the route config

    log.debug(`Creating Authorization scheme for ${authKey}`)

    // Create the Auth Scheme for the endpoint
    const scheme = createAuthScheme(
      authorizerOptions,
      this.#serverless.service.provider,
      this.#lambda,
    )

    // Set the auth scheme and strategy on the server
    this.#server.auth.scheme(authSchemeName, scheme)
    this.#server.auth.strategy(authStrategyName, authSchemeName)

    return authStrategyName
  }

  #setAuthorizationStrategy(endpoint, functionKey, method, path) {
    /*
     *  The authentication strategy can be provided outside of this project
     *  by injecting the provider through a custom variable in the serverless.yml.
     *
     *  see the example in the tests for more details
     *    /tests/integration/custom-authentication
     */
    const customizations = this.#serverless.service.custom

    if (
      customizations &&
      customizations.offline?.customAuthenticationProvider
    ) {
      const root = resolve(this.#serverless.serviceDir, "require-resolver")
      const customRequire = createRequire(root)

      const provider = customRequire(
        customizations.offline.customAuthenticationProvider,
      )

      const strategy = provider(endpoint, functionKey, method, path)

      this.#server.auth.scheme(
        strategy.scheme,
        strategy.getAuthenticateFunction,
      )
      this.#server.auth.strategy(strategy.name, strategy.scheme)

      return strategy.name
    }

    // If the endpoint has an authorization function, create an authStrategy for the route
    const authStrategyName = this.#options.noAuth
      ? null
      : this.#configureJWTAuthorization(endpoint, functionKey, method, path) ||
        this.#configureAuthorization(endpoint, functionKey, method, path)

    return authStrategyName
  }

  #createHapiHandler(params) {
    const {
      additionalRequestContext,
      endpoint,
      functionKey,
      hapiMethod,
      hapiPath,
      method,
      protectedRoute,
      stage,
    } = params

    return async (request, h) => {
      const requestPath =
        endpoint.isHttpApi || this.#options.noPrependStageInUrl
          ? request.path
          : request.path.substr(`/${stage}`.length)

      // payload processing
      const encoding = detectEncoding(request)

      request.raw.req.payload = request.payload
      request.payload = request.payload && request.payload.toString(encoding)
      request.rawPayload = request.payload

      // incoming request message
      log.notice()

      log.notice()
      log.notice(`${method} ${request.path} (λ: ${functionKey})`)

      // check for APIKey
      if (
        (protectedRoute === `${hapiMethod}#${hapiPath}` ||
          protectedRoute === `ANY#${hapiPath}`) &&
        !this.#options.noAuth
      ) {
        const errorResponse = () =>
          h
            .response({
              message: "Forbidden",
            })
            .code(403)
            .header("x-amzn-ErrorType", "ForbiddenException")
            .type("application/json")

        const apiKey = request.headers["x-api-key"]

        if (apiKey) {
          if (!this.#apiKeysValues.has(apiKey)) {
            log.debug(
              `Method '${method}' of function '${functionKey}' token '${apiKey}' not valid.`,
            )

            return errorResponse()
          }
        } else if (
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.usageIdentifierKey
        ) {
          const { usageIdentifierKey } = request.auth.credentials

          if (!this.#apiKeysValues.has(usageIdentifierKey)) {
            log.debug(
              `Method '${method}' of function '${functionKey}' token '${usageIdentifierKey}' not valid.`,
            )

            return errorResponse()
          }
        } else {
          log.debug(`Missing 'x-api-key' on private function '${functionKey}'.`)

          return errorResponse()
        }
      }

      const response = h.response()
      const contentType = request.mime || "application/json" // default content type

      const { integration, requestTemplates } = endpoint

      // default request template to '' if we don't have a definition pushed in from serverless or endpoint
      const requestTemplate =
        requestTemplates !== undefined && integration === "AWS"
          ? requestTemplates[contentType]
          : ""

      const schemas =
        endpoint?.request?.schemas === undefined
          ? ""
          : endpoint.request.schemas[contentType]

      // https://hapijs.com/api#route-configuration doesn't seem to support selectively parsing
      // so we have to do it ourselves
      const contentTypesThatRequirePayloadParsing = [
        "application/json",
        "application/vnd.api+json",
      ]

      if (
        contentTypesThatRequirePayloadParsing.includes(contentType) &&
        request.payload &&
        request.payload.length > 1
      ) {
        try {
          if (!request.payload || request.payload.length === 0) {
            request.payload = "{}"
          }

          request.payload = parse(request.payload)
        } catch (err) {
          log.debug("error in converting request.payload to JSON:", err)
        }
      }

      log.debug("contentType:", contentType)
      log.debug("requestTemplate:", requestTemplate)
      log.debug("payload:", request.payload)

      /* REQUEST PAYLOAD SCHEMA VALIDATION */
      if (schemas) {
        log.debug("schemas:", schemas)

        try {
          payloadSchemaValidator(schemas, request.payload)
        } catch (err) {
          return this.#reply400(response, err.message, err)
        }
      }

      /* REQUEST TEMPLATE PROCESSING (event population) */

      let event = {}

      if (integration === "AWS") {
        if (requestTemplate) {
          try {
            log.debug("_____ REQUEST TEMPLATE PROCESSING _____")

            event = new LambdaIntegrationEvent(
              request,
              stage,
              requestTemplate,
              requestPath,
            ).create()
          } catch (err) {
            return this.#reply502(
              response,
              `Error while parsing template "${contentType}" for ${functionKey}`,
              err,
            )
          }
        } else if (typeof request.payload === "object") {
          event = request.payload || {}
        }
      } else if (integration === "AWS_PROXY") {
        const lambdaProxyIntegrationEvent =
          endpoint.isHttpApi && endpoint.payload === "2.0"
            ? new LambdaProxyIntegrationEventV2(
                request,
                stage,
                endpoint.routeKey,
                additionalRequestContext,
              )
            : new LambdaProxyIntegrationEvent(
                request,
                stage,
                requestPath,
                endpoint.isHttpApi ? endpoint.routeKey : null,
                additionalRequestContext,
              )

        event = lambdaProxyIntegrationEvent.create()

        const customizations = this.#serverless.service.custom
        const hasCustomAuthProvider =
          customizations?.offline?.customAuthenticationProvider

        if (!endpoint.authorizer && !hasCustomAuthProvider) {
          log.debug("no authorizer configured, deleting authorizer payload")
          delete event.requestContext.authorizer
        }
      }

      log.debug("event:", event)

      const lambdaFunction = this.#lambda.get(functionKey)

      lambdaFunction.setEvent(event)

      let result
      let err

      try {
        result = await lambdaFunction.runHandler()
      } catch (_err) {
        err = _err
      }

      // const processResponse = (err, data) => {
      // Everything in this block happens once the lambda function has resolved

      log.debug("_____ HANDLER RESOLVED _____")

      let responseName = "default"
      const { contentHandling, responseContentType } = endpoint

      /* RESPONSE SELECTION (among endpoint's possible responses) */

      // Failure handling
      let errorStatusCode = "502"

      if (err) {
        const errorMessage = (err.message || err).toString()

        const found = errorMessage.match(/\[(\d{3})]/)

        if (found && found.length > 1) {
          ;[, errorStatusCode] = found
        } else {
          errorStatusCode = "502"
        }

        // Mocks Lambda errors
        result = {
          errorMessage,
          errorType: err.constructor.name,
          stackTrace: this.#getArrayStackTrace(err.stack),
        }

        log.error(errorMessage)

        for (const [key, value] of entries(endpoint.responses)) {
          if (
            key !== "default" &&
            `^${value.selectionPattern || key}$`.test(errorMessage)
          ) {
            responseName = key
            break
          }
        }
      }

      log.debug(`Using response '${responseName}'`)

      const chosenResponse = endpoint.responses?.[responseName] ?? {}
      /* RESPONSE PARAMETERS PROCCESSING */

      const { responseParameters } = chosenResponse

      if (responseParameters) {
        log.debug("_____ RESPONSE PARAMETERS PROCCESSING _____")
        log.debug(
          `Found ${
            keys(responseParameters).length
          } responseParameters for '${responseName}' response`,
        )

        // responseParameters use the following shape: "key": "value"
        entries(responseParameters).forEach(([key, value]) => {
          const keyArray = key.split(".") // eg: "method.response.header.location"
          const valueArray = value.split(".") // eg: "integration.response.body.redirect.url"

          log.debug(`Processing responseParameter "${key}": "${value}"`)

          // For now the plugin only supports modifying headers
          if (key.startsWith("method.response.header") && keyArray[3]) {
            const headerName = keyArray.slice(3).join(".")
            let headerValue

            log.debug("Found header in left-hand:", headerName)

            if (value.startsWith("integration.response")) {
              if (valueArray[2] === "body") {
                log.debug("Found body in right-hand")

                headerValue = valueArray[3]
                  ? jsonPath(result, valueArray.slice(3).join("."))
                  : result

                headerValue = headerValue == null ? "" : String(headerValue)
              } else {
                log.notice()

                log.warning()
                log.warning(
                  `Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" (for "${key}"") instead. Skipping.`,
                )

                this.#logPluginIssue()
                log.notice()
              }
            } else {
              headerValue = /^'.*'$/.test(value) ? value.slice(1, -1) : value // See #34
            }
            // Applies the header;
            if (headerValue === "") {
              log.warning(
                `Empty value for responseParameter "${key}": "${value}", it won't be set`,
              )
            } else {
              log.debug(
                `Will assign "${headerValue}" to header "${headerName}"`,
              )

              response.header(headerName, headerValue)
            }
          } else {
            log.notice()

            log.warning()
            log.warning(
              `Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`,
            )

            this.#logPluginIssue()
            log.notice()
          }
        })
      }

      let statusCode = 200

      if (integration === "AWS") {
        const endpointResponseHeaders =
          (endpoint.response && endpoint.response.headers) || {}

        entries(endpointResponseHeaders)
          .filter(
            ([, value]) => typeof value === "string" && /^'.*?'$/.test(value),
          )
          .forEach(([key, value]) => response.header(key, value.slice(1, -1)))

        /* LAMBDA INTEGRATION RESPONSE TEMPLATE PROCCESSING */

        // If there is a responseTemplate, we apply it to the result
        const { responseTemplates } = chosenResponse

        if (
          typeof responseTemplates === "object" &&
          keys(responseTemplates).length > 0
        ) {
          // BAD IMPLEMENTATION: first key in responseTemplates
          const responseTemplate = responseTemplates[responseContentType]

          if (responseTemplate && responseTemplate !== "\n") {
            log.debug("_____ RESPONSE TEMPLATE PROCCESSING _____")
            log.debug(`Using responseTemplate '${responseContentType}'`)

            try {
              const reponseContext = new VelocityContext(
                request,
                stage,
                result,
              ).getContext()

              result = renderVelocityTemplateObject(
                {
                  root: responseTemplate,
                },
                reponseContext,
              ).root
            } catch (error) {
              log.error(
                `Error while parsing responseTemplate '${responseContentType}' for lambda ${functionKey}:\n${error.stack}`,
              )
            }
          }
        }

        /* LAMBDA INTEGRATION HAPIJS RESPONSE CONFIGURATION */
        statusCode = chosenResponse.statusCode || 200

        if (err) {
          statusCode = errorStatusCode
        }

        if (!chosenResponse.statusCode) {
          log.notice()

          log.warning()
          log.warning(`No statusCode found for response "${responseName}".`)
        }

        response.header("Content-Type", responseContentType, {
          override: false, // Maybe a responseParameter set it already. See #34
        })

        response.statusCode = statusCode

        if (contentHandling === "CONVERT_TO_BINARY") {
          response.encoding = "binary"
          response.source = Buffer.from(result, "base64")
          response.variety = "buffer"
        } else if (typeof result === "string") {
          response.source = stringify(result)
        } else {
          response.source = result
        }
      } else if (integration === "AWS_PROXY") {
        /* LAMBDA PROXY INTEGRATION HAPIJS RESPONSE CONFIGURATION */

        if (
          endpoint.isHttpApi &&
          endpoint.payload === "2.0" &&
          (typeof result === "string" || !result.statusCode)
        ) {
          const body = typeof result === "string" ? result : stringify(result)
          result = {
            body,
            headers: {
              "Content-Type": "application/json",
            },
            isBase64Encoded: false,
            statusCode: 200,
          }
        }

        if (result && !result.errorType) {
          statusCode = result.statusCode || 200
        } else if (err) {
          statusCode = errorStatusCode || 502
        } else {
          statusCode = 502
        }

        response.statusCode = statusCode

        const headers = {}

        if (result && result.headers) {
          entries(result.headers).forEach(([headerKey, headerValue]) => {
            headers[headerKey] = (headers[headerKey] || []).concat(headerValue)
          })
        }
        if (result && result.multiValueHeaders) {
          entries(result.multiValueHeaders).forEach(
            ([headerKey, headerValue]) => {
              headers[headerKey] = (headers[headerKey] || []).concat(
                headerValue,
              )
            },
          )
        }

        log.debug("headers", headers)

        const parseCookies = (headerValue) => {
          const cookieName = headerValue.slice(0, headerValue.indexOf("="))
          const cookieValue = headerValue.slice(headerValue.indexOf("=") + 1)

          h.state(cookieName, cookieValue, {
            encoding: "none",
            strictHeader: false,
          })
        }

        entries(headers).forEach(([headerKey, headerValue]) => {
          if (headerKey.toLowerCase() === "set-cookie") {
            headerValue.forEach(parseCookies)
          } else {
            headerValue.forEach((value) => {
              // it looks like Hapi doesn't support multiple headers with the same name,
              // appending values is the closest we can come to the AWS behavior.
              response.header(headerKey, value, {
                append: true,
              })
            })
          }
        })

        if (
          endpoint.isHttpApi &&
          endpoint.payload === "2.0" &&
          result.cookies
        ) {
          result.cookies.forEach(parseCookies)
        }

        response.header("Content-Type", "application/json", {
          duplicate: false,
          override: false,
        })

        if (typeof result === "string") {
          response.source = stringify(result)
        } else if (result && result.body !== undefined) {
          if (result.isBase64Encoded) {
            response.encoding = "binary"
            response.source = Buffer.from(result.body, "base64")
            response.variety = "buffer"
          } else {
            if (result && result.body && typeof result.body !== "string") {
              // FIXME TODO we should probably just write to console instead of returning a payload
              return this.#reply502(
                response,
                "According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object",
                {},
              )
            }
            response.source = result.body
          }
        }
      }

      return response
    }
  }

  createRoutes(functionKey, httpEvent, handler) {
    if (!this.#hasPrivateHttpEvent && httpEvent.private) {
      this.#hasPrivateHttpEvent = true

      if (this.#options.noAuth) {
        log.notice(
          `Authorizers are turned off. You do not need to use 'x-api-key' header.`,
        )
      } else {
        log.notice(`Remember to use 'x-api-key' on the request headers.`)
      }

      if (this.#apiKeysValues == null) {
        this.#apiKeysValues = getApiKeysValues(
          this.#serverless.service.provider.apiGateway?.apiKeys ?? [],
        )

        if (this.#apiKeysValues.size === 0) {
          const apiKey = createApiKey()

          this.#apiKeysValues.add(apiKey)

          log.notice(`Key with token: '${apiKey}'`)
        }
      }
    }

    let method
    let path
    let hapiPath

    if (httpEvent.isHttpApi) {
      if (httpEvent.routeKey === "$default") {
        method = "ANY"
        path = httpEvent.routeKey
        hapiPath = "/{default*}"
      } else {
        ;[method, path] = httpEvent.routeKey.split(" ")
        hapiPath = generateHapiPath(
          path,
          {
            ...this.#options,
            noPrependStageInUrl: true, // Serverless always uses the $default stage
          },
          this.#serverless,
        )
      }
    } else {
      method = httpEvent.method.toUpperCase()
      ;({ path } = httpEvent)
      hapiPath = generateHapiPath(path, this.#options, this.#serverless)
    }

    const [handlerPath] = splitHandlerPathAndName(handler)

    const endpoint = new Endpoint(
      join(this.#serverless.config.servicePath, handlerPath),
      httpEvent,
    ).generate()

    const stage = endpoint.isHttpApi
      ? "$default"
      : this.#options.stage || this.#serverless.service.provider.stage

    const protectedRoute = httpEvent.private
      ? `${method}#${hapiPath}`
      : undefined

    const { host, httpPort, httpsProtocol } = this.#options
    const server = `${httpsProtocol ? "https" : "http"}://${host}:${httpPort}`

    this.#terminalInfo.push({
      invokePath: `/2015-03-31/functions/${functionKey}/invocations`,
      method,
      path: hapiPath,
      server,
      stage:
        endpoint.isHttpApi || this.#options.noPrependStageInUrl ? null : stage,
    })

    const authStrategyName = this.#setAuthorizationStrategy(
      endpoint,
      functionKey,
      method,
      path,
    )

    let cors = null
    if (endpoint.cors) {
      cors = {
        credentials:
          endpoint.cors.credentials || this.#options.corsConfig.credentials,
        exposedHeaders: this.#options.corsConfig.exposedHeaders,
        headers: endpoint.cors.headers || this.#options.corsConfig.headers,
        origin: endpoint.cors.origins || this.#options.corsConfig.origin,
      }
    } else if (
      this.#serverless.service.provider.httpApi &&
      this.#serverless.service.provider.httpApi.cors
    ) {
      const httpApiCors = getHttpApiCorsConfig(
        this.#serverless.service.provider.httpApi.cors,
        this,
      )
      cors = {
        credentials: httpApiCors.allowCredentials,
        exposedHeaders: httpApiCors.exposedResponseHeaders || [],
        headers: httpApiCors.allowedHeaders || [],
        maxAge: httpApiCors.maxAge,
        origin: httpApiCors.allowedOrigins || [],
      }
    }

    const hapiMethod = method === "ANY" ? "*" : method

    const state = this.#options.disableCookieValidation
      ? {
          failAction: "ignore",
          parse: false,
        }
      : {
          failAction: "error",
          parse: true,
        }

    const hapiOptions = {
      auth: authStrategyName,
      cors,
      response: {
        emptyStatusCode: 200,
      },
      state,
      timeout: {
        socket: false,
      },
    }

    // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
    // for more details, check https://github.com/dherault/serverless-offline/issues/204
    if (hapiMethod === "HEAD") {
      log.notice(
        "HEAD method event detected. Skipping HAPI server route mapping",
      )

      return
    }

    if (hapiMethod !== "HEAD" && hapiMethod !== "GET") {
      // maxBytes: Increase request size from 1MB default limit to 10MB.
      // Cf AWS API GW payload limits.
      hapiOptions.payload = {
        maxBytes: 1024 * 1024 * 10,
        parse: false,
      }
    }

    const additionalRequestContext = {}
    if (httpEvent.operationId) {
      additionalRequestContext.operationName = httpEvent.operationId
    }

    hapiOptions.tags = ["api"]

    const hapiHandler = this.#createHapiHandler({
      additionalRequestContext,
      endpoint,
      functionKey,
      hapiMethod,
      hapiPath,
      method,
      protectedRoute,
      stage,
    })

    this.#server.route({
      handler: hapiHandler,
      method: hapiMethod,
      options: hapiOptions,
      path: hapiPath,
    })
  }

  #replyError(statusCode, response, message, error) {
    log.notice(message)

    log.error(error)

    response.header("Content-Type", "application/json")

    response.statusCode = statusCode
    response.source = {
      errorMessage: message,
      errorType: error.constructor.name,
      offlineInfo:
        "If you believe this is an issue with serverless-offline please submit it, thanks. https://github.com/dherault/serverless-offline/issues",
      stackTrace: this.#getArrayStackTrace(error.stack),
    }

    return response
  }

  // Bad news
  #reply502(response, message, error) {
    // APIG replies 502 by default on failures;
    return this.#replyError(502, response, message, error)
  }

  #reply400(response, message, error) {
    return this.#replyError(400, response, message, error)
  }

  createResourceRoutes() {
    const resourceRoutesOptions = this.#options.resourceRoutes

    if (!resourceRoutesOptions) {
      return
    }

    const resourceRoutes = parseResources(this.#serverless.service.resources)

    if (!resourceRoutes || keys(resourceRoutes).length === 0) {
      return
    }

    log.notice()

    log.notice()
    log.notice("Routes defined in resources:")

    entries(resourceRoutes).forEach(([methodId, resourceRoutesObj]) => {
      const { isProxy, method, pathResource, proxyUri } = resourceRoutesObj

      if (!isProxy) {
        log.warning(
          `Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`,
        )

        return
      }
      if (!pathResource) {
        log.warning(`Could not resolve path for '${methodId}'.`)

        return
      }

      const hapiPath = generateHapiPath(
        pathResource,
        this.#options,
        this.#serverless,
      )
      const proxyUriOverwrite = resourceRoutesOptions[methodId] || {}
      const proxyUriInUse = proxyUriOverwrite.Uri || proxyUri

      if (!proxyUriInUse) {
        log.warning(`Could not load Proxy Uri for '${methodId}'`)

        return
      }

      const hapiMethod = method === "ANY" ? "*" : method

      const state = this.#options.disableCookieValidation
        ? {
            failAction: "ignore",
            parse: false,
          }
        : {
            failAction: "error",
            parse: true,
          }

      const hapiOptions = {
        cors: this.#options.corsConfig,
        state,
      }

      // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
      // for more details, check https://github.com/dherault/serverless-offline/issues/204
      if (hapiMethod === "HEAD") {
        log.notice(
          "HEAD method event detected. Skipping HAPI server route mapping",
        )

        return
      }

      if (hapiMethod !== "GET" && hapiMethod !== "HEAD") {
        hapiOptions.payload = {
          parse: false,
        }
      }

      log.notice(`${method} ${hapiPath} -> ${proxyUriInUse}`)

      // hapiOptions.tags = ['api']

      const route = {
        handler(request, h) {
          const { params } = request
          let resultUri = proxyUriInUse

          entries(params).forEach(([key, value]) => {
            resultUri = resultUri.replace(`{${key}}`, value)
          })

          if (request.url.search !== null) {
            resultUri += request.url.search // search is empty string by default
          }

          log.notice(
            `PROXY ${request.method} ${request.url.pathname} -> ${resultUri}`,
          )

          return h.proxy({
            passThrough: true,
            uri: resultUri,
          })
        },
        method: hapiMethod,
        options: hapiOptions,
        path: hapiPath,
      }

      this.#server.route(route)
    })
  }

  create404Route() {
    // If a {proxy+} or $default route exists, don't conflict with it
    if (this.#server.match("*", "/{p*}")) {
      return
    }

    const existingRoutes = this.#server
      .table()
      // Exclude this (404) route
      .filter((route) => route.path !== "/{p*}")
      // Sort by path
      .sort((a, b) => (a.path <= b.path ? -1 : 1))
      // Human-friendly result
      .map((route) => `${route.method} - ${route.path}`)

    const route = {
      handler(request, h) {
        const response = h.response({
          currentRoute: `${request.method} - ${request.path}`,
          error: "Serverless-offline: route not found.",
          existingRoutes,
          statusCode: 404,
        })
        response.statusCode = 404

        return response
      },
      method: "*",
      options: {
        cors: this.#options.corsConfig,
      },
      path: "/{p*}",
    }

    this.#server.route(route)
  }

  #getArrayStackTrace(stack) {
    if (!stack) return null

    const splittedStack = stack.split("\n")

    return splittedStack
      .slice(
        0,
        splittedStack.findIndex((item) =>
          item.match(/server.route.handler.LambdaContext/),
        ),
      )
      .map((line) => line.trim())
  }

  writeRoutesTerminal() {
    logRoutes(this.#terminalInfo)
  }

  // TEMP FIXME quick fix to expose gateway server for testing, look for better solution
  getServer() {
    return this.#server
  }
}
