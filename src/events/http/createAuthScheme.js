import Boom from '@hapi/boom'
import { log } from '@serverless/utils/log.js'
import authCanExecuteResource from '../authCanExecuteResource.js'
import authValidateContext from '../authValidateContext.js'
import {
  getRawQueryParams,
  nullIfEmpty,
  parseHeaders,
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
} from '../../utils/index.js'

const IDENTITY_SOURCE_TYPE_HEADER = 'header'
const IDENTITY_SOURCE_TYPE_QUERYSTRING = 'querystring'
const IDENTITY_SOURCE_TYPE_CONTEXT = 'context'

export default function createAuthScheme(authorizerOptions, provider, lambda) {
  const authFunName = authorizerOptions.name
  let identitySourceRecord = []

  const finalizeAuthScheme = () => {
    return () => ({
      async authenticate(request, h) {
        log.notice()
        log.notice(
          `Running Authorization function for ${request.method} ${request.path} (λ: ${authFunName})`,
        )

        const { rawHeaders, url } = request.raw.req

        // Get path params
        // aws doesn't auto decode path params - hapi does
        const pathParams = { ...request.params }

        const accountId = 'random-account-id'
        const apiId = 'random-api-id'
        const requestId = 'random-request-id'

        const httpMethod = request.method.toUpperCase()
        const resourcePath = request.route.path.replace(
          new RegExp(`^/${provider.stage}`),
          '',
        )

        let event = {
          enhancedAuthContext: {},
          headers: parseHeaders(rawHeaders),
          requestContext: {
            accountId,
            apiId,
            domainName: `${apiId}.execute-api.us-east-1.amazonaws.com`,
            domainPrefix: apiId,
            requestId,
            stage: provider.stage,
          },
          version: authorizerOptions.payloadVersion,
        }

        const protocol = `${request.server.info.protocol.toUpperCase()}/${
          request.raw.req.httpVersion
        }`
        const currentDate = new Date()
        const resourceId = `${httpMethod} ${resourcePath}`
        const methodArn = `arn:aws:execute-api:${provider.region}:${accountId}:${apiId}/${provider.stage}/${httpMethod}${resourcePath}`

        const identitySources = []
        for (const { type, field } of identitySourceRecord) {
          let identitySource
          switch (type) {
            case IDENTITY_SOURCE_TYPE_HEADER: {
              const headers = request.raw.req.headers ?? {}
              identitySource = headers[field]
              break
            }

            case IDENTITY_SOURCE_TYPE_QUERYSTRING: {
              const queryStringParameters =
                parseQueryStringParameters(url) ?? {}
              identitySource = queryStringParameters[field]
              break
            }

            case IDENTITY_SOURCE_TYPE_CONTEXT: {
              // Context is handled differently by different providers,
              // our context is very limited so we return the field name by default.
              identitySource = event.requestContext[field] ?? field
              break
            }

            default: {
              throw new Error(
                `No Authorization source has been specified. This should never happen. (λ: ${authFunName})`,
              )
            }
          }

          if (identitySource === undefined) {
            log.error(
              `Identity Source is null for ${type} ${field} (λ: ${authFunName})`,
            )
            return Boom.unauthorized(
              'User is not authorized to access this resource',
            )
          }

          log.debug(`Retrieved ${field} ${type} "${identitySource}"`)

          const identityValidationExpression = new RegExp(
            authorizerOptions.identityValidationExpression,
          )
          const matchedIdentitySource =
            identityValidationExpression.test(identitySource)
          if (matchedIdentitySource) {
            identitySources.push(identitySource)
          }
        }

        if (authorizerOptions.payloadVersion === '1.0') {
          event = {
            ...event,
            authorizationToken: identitySources.join(','),
            httpMethod: request.method.toUpperCase(),
            identitySource: identitySources.join(','),
            methodArn,
            multiValueHeaders: parseMultiValueHeaders(rawHeaders),
            multiValueQueryStringParameters:
              parseMultiValueQueryStringParameters(url),
            path: request.path,
            pathParameters: nullIfEmpty(pathParams),
            queryStringParameters: parseQueryStringParameters(url),
            requestContext: {
              extendedRequestId: requestId,
              httpMethod,
              path: request.path,
              protocol,
              requestTime: currentDate.toString(),
              requestTimeEpoch: currentDate.getTime(),
              resourceId,
              resourcePath,
              stage: provider.stage,
            },
            resource: resourcePath,
          }
        }

        if (authorizerOptions.payloadVersion === '2.0') {
          event = {
            ...event,
            identitySource: identitySources,
            rawPath: request.path,
            rawQueryString: getRawQueryParams(url),
            requestContext: {
              http: {
                method: httpMethod,
                path: resourcePath,
                protocol,
              },
              routeKey: resourceId,
              time: currentDate.toString(),
              timeEpoch: currentDate.getTime(),
            },
            routeArn: methodArn,
            routeKey: resourceId,
          }
        }

        //   methodArn is the ARN of the function we are running we are authorizing access to (or not)
        //   Account ID and API ID are not simulated
        if (authorizerOptions.type === 'request') {
          event = {
            ...event,
            type: 'REQUEST',
          }
        } else {
          // This is safe since type: 'TOKEN' cannot have payload format 2.0
          event = {
            ...event,
            type: 'TOKEN',
          }
        }

        const lambdaFunction = lambda.get(authFunName)
        lambdaFunction.setEvent(event)

        try {
          const result = await lambdaFunction.runHandler()

          if (authorizerOptions.enableSimpleResponses) {
            if (result.isAuthorized) {
              const authorizer = {
                integrationLatency: '42',
                ...result.context,
              }
              return h.authenticated({
                credentials: {
                  authorizer,
                  context: result.context || {},
                },
              })
            }
            return Boom.forbidden(
              'User is not authorized to access this resource',
            )
          }

          if (result === 'Unauthorized')
            return Boom.unauthorized('Unauthorized')

          // Validate that the policy document has the principalId set
          if (!result.principalId) {
            log.notice(
              `Authorization response did not include a principalId: (λ: ${authFunName})`,
            )

            return Boom.forbidden('No principalId set on the Response')
          }

          if (
            !authCanExecuteResource(
              result.policyDocument,
              event.methodArn || event.routeArn,
            )
          ) {
            log.notice(
              `Authorization response didn't authorize user to access resource: (λ: ${authFunName})`,
            )

            return Boom.forbidden(
              'User is not authorized to access this resource',
            )
          }

          // validate the resulting context, ensuring that all
          // values are either string, number, or boolean types
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

          // Set the credentials for the rest of the pipeline
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

  const checkForIdentitySourceMatch = () => {
    const identitySourceRegExp = new RegExp(
      `(?:method.|\\$)(?:request.)*(${IDENTITY_SOURCE_TYPE_CONTEXT}|${IDENTITY_SOURCE_TYPE_HEADER}|${IDENTITY_SOURCE_TYPE_QUERYSTRING}).((?:\\w+-?\\.?)+\\w)`,
      'g',
    )

    const identitySourceMatches =
      authorizerOptions.identitySource.matchAll(identitySourceRegExp)

    const typesAndFields = []
    for (const match of identitySourceMatches) {
      const expectedLength = 3
      if (match.length === expectedLength) {
        typesAndFields.push({
          field: match[2],
          type: match[1],
        })
      }
    }
    return typesAndFields
  }

  if (
    authorizerOptions.type !== 'request' ||
    authorizerOptions.identitySource
  ) {
    identitySourceRecord = checkForIdentitySourceMatch()

    if (identitySourceRecord.length > 0) {
      return finalizeAuthScheme()
    }

    throw new Error(
      `Serverless Offline only supports retrieving tokens from headers and querystring parameters (λ: ${authFunName})`,
    )
  }

  return finalizeAuthScheme()
}
