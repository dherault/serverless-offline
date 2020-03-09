import serverlessLog from '../../serverlessLog.js'

// FIXME "slessLog" param is only remaining for tests, should be removed
export default function authFunctionNameExtractor(authorizer, slessLog) {
  const buildFailureResult = (warningMessage) => {
    const _serverlessLog = slessLog || serverlessLog // FIXME remove

    _serverlessLog(warningMessage)

    return { unsupportedAuth: true }
  }

  const buildSuccessResult = (authorizerName) => ({ authorizerName })

  const handleStringAuthorizer = (authorizerString) => {
    if (authorizerString.toUpperCase() === 'AWS_IAM') {
      return buildFailureResult(
        'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
      )
    }

    return buildSuccessResult(authorizerString)
  }

  const handleObjectAuthorizer = (authorizerObject) => {
    const { arn, authorizerId, name, type } = authorizerObject

    if (type && type.toUpperCase() === 'AWS_IAM') {
      return buildFailureResult(
        'WARNING: Serverless Offline does not support the AWS_IAM authorization type',
      )
    }

    if (arn) {
      return buildFailureResult(
        `WARNING: Serverless Offline does not support non local authorizers (arn): ${arn}`,
      )
    }

    if (authorizerId) {
      return buildFailureResult(
        `WARNING: Serverless Offline does not support non local authorizers (authorizerId): ${authorizerId}`,
      )
    }

    if (!name) {
      return buildFailureResult(
        'WARNING: Serverless Offline supports local authorizers but authorizer name is missing',
      )
    }

    return buildSuccessResult(name)
  }

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
    'WARNING: Serverless Offline supports only local authorizers defined as string or object',
  )
}
