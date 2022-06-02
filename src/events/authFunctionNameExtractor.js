export default function authFunctionNameExtractor(endpoint, v3Utils) {
  const buildFailureResult = (warningMessage) => {
    v3Utils.log.warning(warningMessage)

    return { unsupportedAuth: true }
  }

  const buildSuccessResult = (authorizerName) => ({ authorizerName })

  const handleStringAuthorizer = (authorizerString) => {
    if (authorizerString.toUpperCase() === 'AWS_IAM') {
      return buildFailureResult(
        'Serverless Offline does not support the AWS_IAM authorization type',
      )
    }

    return buildSuccessResult(authorizerString)
  }

  const handleObjectAuthorizer = (authorizerObject) => {
    const { arn, authorizerId, name, type } = authorizerObject

    if (type && type.toUpperCase() === 'AWS_IAM') {
      return buildFailureResult(
        'Serverless Offline does not support the AWS_IAM authorization type',
      )
    }

    if (arn) {
      return buildFailureResult(
        `Serverless Offline does not support non local authorizers (arn): ${arn}`,
      )
    }

    if (authorizerId) {
      return buildFailureResult(
        `Serverless Offline does not support non local authorizers (authorizerId): ${authorizerId}`,
      )
    }

    if (!name) {
      return buildFailureResult(
        'Serverless Offline supports local authorizers but authorizer name is missing',
      )
    }

    return buildSuccessResult(name)
  }

  const { authorizer } = endpoint

  if (!authorizer) {
    return buildSuccessResult(null)
  }

  if (typeof authorizer === 'string') {
    return handleStringAuthorizer(authorizer)
  }

  if (typeof authorizer === 'object') {
    return handleObjectAuthorizer(authorizer)
  }

  return buildFailureResult(
    'Serverless Offline supports only local authorizers defined as string or object',
  )
}
