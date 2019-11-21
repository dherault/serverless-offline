import Boom from '@hapi/boom'
import authCanExecuteResource from './authCanExecuteResource.js'
import debugLog from '../../debugLog.js'
import serverlessLog from '../../serverlessLog.js'
import {
  createUniqueId,
  nullIfEmpty,
  parseHeaders,
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
} from '../../utils/index.js'

export default function createAuthScheme(
  authFun,
  authorizerOptions,
  functionName,
  endpointPath,
  options,
  servicePath,
  provider,
  lambda,
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

  // Create Auth Scheme
  return () => ({
    async authenticate(request, h) {
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

      const lambdaFunction = lambda.get(authFunName)
      lambdaFunction.setEvent(event)

      const requestId = createUniqueId()
      lambdaFunction.setRequestId(requestId)

      try {
        const result = await lambdaFunction.runHandler()

        const {
          billedExecutionTimeInMillis,
          executionTimeInMillis,
        } = lambdaFunction

        serverlessLog(
          `(λ: ${authFunName}) RequestId: ${requestId}  Duration: ${executionTimeInMillis.toFixed(
            2,
          )} ms  Billed Duration: ${billedExecutionTimeInMillis} ms`,
        )

        // return processResponse(null, result)
        const policy = result

        // Validate that the policy document has the principalId set
        if (!policy.principalId) {
          serverlessLog(
            `Authorization response did not include a principalId: (λ: ${authFunName})`,
          )

          return Boom.forbidden('No principalId set on the Response')
        }

        if (!authCanExecuteResource(policy.policyDocument, event.methodArn)) {
          serverlessLog(
            `Authorization response didn't authorize user to access resource: (λ: ${authFunName})`,
          )

          return Boom.forbidden(
            'User is not authorized to access this resource',
          )
        }

        serverlessLog(
          `Authorization function returned a successful response: (λ: ${authFunName})`,
        )

        const authorizer = {
          integrationLatency: '42',
          principalId: policy.principalId,
          ...policy.context,
        }

        // Set the credentials for the rest of the pipeline
        // return resolve(
        return h.authenticated({
          credentials: {
            authorizer,
            context: policy.context,
            principalId: policy.principalId,
            usageIdentifierKey: policy.usageIdentifierKey,
          },
        })
      } catch (err) {
        serverlessLog(
          `Authorization function returned an error response: (λ: ${authFunName})`,
          err,
        )

        return Boom.unauthorized('Unauthorized')
      }
    },
  })
}
