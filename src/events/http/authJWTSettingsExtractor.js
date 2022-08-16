import { log } from '@serverless/utils/log.js'

function buildFailureResult(warningMessage) {
  log.warning(warningMessage)

  return {
    unsupportedAuth: true,
  }
}

function buildSuccessResult(authorizerName) {
  return {
    authorizerName,
  }
}

export default function authJWTSettingsExtractor(
  endpoint,
  provider,
  ignoreJWTSignature,
) {
  const { authorizer } = endpoint

  if (!authorizer) {
    return buildSuccessResult(null)
  }

  if (!provider.httpApi || !provider.httpApi.authorizers) {
    return buildSuccessResult(null)
  }

  // TODO: add code that will actually validate a JWT.
  if (!ignoreJWTSignature) {
    return buildSuccessResult(null)
  }

  if (!authorizer.name) {
    return buildFailureResult(
      'Serverless Offline supports only JWT authorizers referenced by name',
    )
  }

  const httpApiAuthorizer = provider.httpApi.authorizers[authorizer.name]

  if (!httpApiAuthorizer) {
    return buildFailureResult(`JWT authorizer ${authorizer.name} not found`)
  }

  if (!httpApiAuthorizer.identitySource) {
    return buildFailureResult(
      `JWT authorizer ${authorizer.name} missing identity source`,
    )
  }

  if (!httpApiAuthorizer.issuerUrl) {
    return buildFailureResult(
      `JWT authorizer ${authorizer.name} missing issuer url`,
    )
  }

  if (!httpApiAuthorizer.audience || httpApiAuthorizer.audience.length === 0) {
    return buildFailureResult(
      `JWT authorizer ${authorizer.name} missing audience`,
    )
  }

  const result = {
    authorizerName: authorizer.name,
    ...authorizer,
    ...httpApiAuthorizer,
  }

  return result
}
