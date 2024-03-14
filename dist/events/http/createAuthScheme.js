import Boom from '@hapi/boom'
import { log } from '@serverless/utils/log.js'
import authCanExecuteResource from '../authCanExecuteResource.js'
import authValidateContext from '../authValidateContext.js'
import {
  nullIfEmpty,
  parseHeaders,
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
} from '../../utils/index.js'
export default function createAuthScheme(authorizerOptions, provider, lambda) {
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
  return () => ({
    async authenticate(request, h) {
      log.notice()
      log.notice(
        `Running Authorization function for ${request.method} ${request.path} (λ: ${authFunName})`,
      )
      const { req } = request.raw
      const pathParams = {
        ...request.params,
      }
      const accountId = 'random-account-id'
      const apiId = 'random-api-id'
      const httpMethod = request.method.toUpperCase()
      const resourcePath = request.route.path.replace(
        new RegExp(`^/${provider.stage}`),
        '',
      )
      let event = {
        enhancedAuthContext: {},
        methodArn: `arn:aws:execute-api:${provider.region}:${accountId}:${apiId}/${provider.stage}/${httpMethod}${resourcePath}`,
        requestContext: {
          accountId,
          apiId,
          httpMethod,
          path: request.path,
          requestId: 'random-request-id',
          resourceId: 'random-resource-id',
          resourcePath,
          stage: provider.stage,
        },
        resource: resourcePath,
      }
      if (authorizerOptions.type === 'request') {
        const { rawHeaders, url } = req
        event = {
          ...event,
          headers: parseHeaders(rawHeaders),
          httpMethod: request.method.toUpperCase(),
          multiValueHeaders: parseMultiValueHeaders(rawHeaders),
          multiValueQueryStringParameters:
            parseMultiValueQueryStringParameters(url),
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
        const matchedAuthorization =
          identityValidationExpression.test(authorization)
        const finalAuthorization = matchedAuthorization ? authorization : ''
        log.debug(`Retrieved ${identityHeader} header "${finalAuthorization}"`)
        event = {
          ...event,
          authorizationToken: finalAuthorization,
          type: 'TOKEN',
        }
      }
      const lambdaFunction = lambda.get(authFunName)
      lambdaFunction.setEvent(event)
      try {
        const result = await lambdaFunction.runHandler()
        if (result === 'Unauthorized') return Boom.unauthorized('Unauthorized')
        if (!result.principalId) {
          log.notice(
            `Authorization response did not include a principalId: (λ: ${authFunName})`,
          )
          return Boom.forbidden('No principalId set on the Response')
        }
        if (!authCanExecuteResource(result.policyDocument, event.methodArn)) {
          log.notice(
            `Authorization response didn't authorize user to access resource: (λ: ${authFunName})`,
          )
          return Boom.forbidden(
            'User is not authorized to access this resource',
          )
        }
        if (result.context) {
          const validationResult = authValidateContext(
            result.context,
            authFunName,
          )
          if (validationResult instanceof Error) {
            return validationResult
          }
          result.context = validationResult
        }
        log.notice(
          `Authorization function returned a successful response: (λ: ${authFunName})`,
        )
        const authorizer = {
          integrationLatency: '42',
          principalId: result.principalId,
          ...result.context,
        }
        return h.authenticated({
          credentials: {
            authorizer,
            context: result.context,
            principalId: result.principalId,
            usageIdentifierKey: result.usageIdentifierKey,
          },
        })
      } catch {
        log.notice(
          `Authorization function returned an error response: (λ: ${authFunName})`,
        )
        return Boom.unauthorized('Unauthorized')
      }
    },
  })
}
