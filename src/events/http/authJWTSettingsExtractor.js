import { log } from "../../utils/log.js"

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

// the endpoint is not protected by the authorizer
function buildSkippedResult(authorizerName) {
  log.warning(
    `JWT authorizer '${authorizerName}' is skipped: the signature of the JWT is not validated, use --ignoreJWTSignature to enable the authorizer`,
  )

  return {
    authorizerName,
    skipped: true,
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
    const httpApiAuthorizer =
      authorizer.name && provider.httpApi.authorizers[authorizer.name]

    // not a JWT authorizer, e.g. a lambda authorizer function referenced by name
    if (!httpApiAuthorizer || httpApiAuthorizer.type === "request") {
      return buildSuccessResult(null)
    }

    return buildSkippedResult(authorizer.name)
  }

  if (!authorizer.name) {
    return buildFailureResult(
      "Serverless Offline supports only JWT authorizers referenced by name",
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
