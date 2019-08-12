import { join } from 'path'
import Boom from '@hapi/boom'
import authCanExecuteResource from './authCanExecuteResource.js'
import debugLog from '../debugLog.js'
import HandlerRunner from '../lambda/handler-runner/index.js'
import LambdaContext from '../lambda/LambdaContext.js'
import serverlessLog from '../serverlessLog.js'
import {
  nullIfEmpty,
  parseHeaders,
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
  splitHandlerPathAndName,
} from '../utils/index.js'

export default function createAuthScheme(
  authFun,
  authorizerOptions,
  functionName,
  endpointPath,
  options,
  servicePath,
  provider,
) {
  const authFunName = authorizerOptions.name

  let identityHeader = 'authorization'

  if (authorizerOptions.type !== 'request') {
    const identitySourceMatch = /^method.request.header.((?:\w+-?)+\w+)$/.exec(
      authorizerOptions.identitySource,
    )
    if (!identitySourceMatch || identitySourceMatch.length !== 2) {
      throw new Error(
        `Serverless Offline only supports retrieving tokens from the headers (λ: ${authFunName})`,
      )
    }
    identityHeader = identitySourceMatch[1].toLowerCase()
  }

  const { handler, memorySize, name, runtime, timeout } = authFun
  const [handlerPath, handlerName] = splitHandlerPathAndName(handler)

  const funOptions = {
    functionName,
    handlerName, // i.e. run
    handlerPath: join(servicePath, handlerPath),
    lambdaName: name,
    memorySize,
    runtime: runtime || provider.runtime,
    timeout: (timeout || 30) * 1000,
  }

  // Create Auth Scheme
  return () => ({
    authenticate(request, h) {
      // TODO FIXME, should use LambdaFunction
      const env = {
        ...provider.environment,
        ...authFun.environment,
        ...process.env,
      }

      console.log('') // Just to make things a little pretty
      serverlessLog(
        `Running Authorization function for ${request.method} ${request.path} (λ: ${authFunName})`,
      )

      // Get Authorization header
      const { req } = request.raw

      // Get path params
      // aws doesn't auto decode path params - hapi does
      const pathParams = { ...request.params }

      let event

      // Create event Object for authFunction
      //   methodArn is the ARN of the function we are running we are authorizing access to (or not)
      //   Account ID and API ID are not simulated
      if (authorizerOptions.type === 'request') {
        const { rawHeaders, url } = req

        event = {
          headers: parseHeaders(rawHeaders),
          httpMethod: request.method.toUpperCase(),
          multiValueHeaders: parseMultiValueHeaders(rawHeaders),
          multiValueQueryStringParameters: parseMultiValueQueryStringParameters(
            url,
          ),
          path: request.path,
          pathParameters: nullIfEmpty(pathParams),
          queryStringParameters: parseQueryStringParameters(url),
          type: 'REQUEST',
        }
      } else {
        const authorization = req.headers[identityHeader]

        const identityValidationExpression = new RegExp(
          authorizerOptions.identityValidationExpression,
        )
        const matchedAuthorization = identityValidationExpression.test(
          authorization,
        )
        const finalAuthorization = matchedAuthorization ? authorization : ''

        debugLog(`Retrieved ${identityHeader} header "${finalAuthorization}"`)

        event = {
          authorizationToken: finalAuthorization,
          type: 'TOKEN',
        }
      }

      const httpMethod = request.method.toUpperCase()
      const apiId = 'random-api-id'
      const accountId = 'random-account-id'
      const resourcePath = request.path.replace(
        new RegExp(`^/${provider.stage}`),
        '',
      )

      event.methodArn = `arn:aws:execute-api:${provider.region}:${accountId}:${apiId}/${provider.stage}/${httpMethod}${resourcePath}`

      event.enhancedAuthContext = {}

      event.requestContext = {
        accountId,
        apiId,
        httpMethod,
        requestId: 'random-request-id',
        resourceId: 'random-resource-id',
        resourcePath,
        stage: provider.stage,
      }

      let handlerRunner

      // Create the Authorization function handler
      try {
        // TODO FIXME, should use LambdaFunction
        handlerRunner = new HandlerRunner(funOptions, options, env)
      } catch (err) {
        debugLog(`create authorization function handler error: ${err}`)

        throw Boom.badImplementation(
          null,
          `Error while loading ${authFunName}: ${err.message}`,
        )
      }

      return new Promise((resolve, reject) => {
        const callback = (err, data) => {
          // Return an unauthorized response
          const onError = (error) => {
            serverlessLog(
              `Authorization function returned an error response: (λ: ${authFunName})`,
              error,
            )

            return reject(Boom.unauthorized('Unauthorized'))
          }

          if (err) {
            onError(err)

            return
          }

          const onSuccess = (policy) => {
            // Validate that the policy document has the principalId set
            if (!policy.principalId) {
              serverlessLog(
                `Authorization response did not include a principalId: (λ: ${authFunName})`,
                err,
              )

              return reject(
                Boom.forbidden('No principalId set on the Response'),
              )
            }

            if (
              !authCanExecuteResource(policy.policyDocument, event.methodArn)
            ) {
              serverlessLog(
                `Authorization response didn't authorize user to access resource: (λ: ${authFunName})`,
                err,
              )

              return reject(
                Boom.forbidden(
                  'User is not authorized to access this resource',
                ),
              )
            }

            serverlessLog(
              `Authorization function returned a successful response: (λ: ${authFunName})`,
            )

            const enhancedAuthContext = {
              principalId: policy.principalId,
              integrationLatency: '42',
              ...policy.context,
            }

            // Set the credentials for the rest of the pipeline
            return resolve(
              h.authenticated({
                credentials: {
                  context: policy.context,
                  enhancedAuthContext,
                  principalId: policy.principalId,
                  usageIdentifierKey: policy.usageIdentifierKey,
                  user: policy.principalId,
                },
              }),
            )
          }

          if (data && typeof data.then === 'function') {
            debugLog('Auth function returned a promise')
            data.then(onSuccess).catch(onError)
          } else if (data instanceof Error) {
            onError(data)
          } else {
            onSuccess(data)
          }
        }

        // TODO FIXME this should just use the LambdaFunction class
        // Creat the Lambda Context for the Auth function
        const lambdaContext = new LambdaContext({
          callback,
          functionName: authFun.name,
          memorySize: authFun.memorySize || provider.memorySize,
          timeout: authFun.timeout || provider.timeout,
        })

        // TODO FIXME this should just use the LambdaFunction class
        const result = handlerRunner.run(event, lambdaContext, callback)

        // Promise support
        if (result && typeof result.then === 'function') {
          result
            .then((data) => callback(null, data))
            .catch((err) => callback(err, null))
        } else if (result instanceof Error) {
          callback(result, null)
        }
      })
    },
  })
}
