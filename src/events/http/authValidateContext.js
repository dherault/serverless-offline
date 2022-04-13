import Boom from '@hapi/boom'
import serverlessLog from '../../serverlessLog.js'

function internalServerError(message) {
  const errorType = 'AuthorizerConfigurationException'

  const error = Boom.internal()
  error.output.payload.message = message
  error.output.payload.error = errorType
  error.output.headers['x-amzn-ErrorType'] = errorType

  return error
}

function isValidContext(context) {
  return Object.values(context).every(
    (i) =>
      typeof i === 'string' || typeof i === 'boolean' || typeof i === 'number',
  )
}

function transform(context) {
  Object.keys(context).forEach((i) => {
    context[i] = context[i].toString()
  })

  return context
}

export default function authValidateContext(context, authFunName) {
  if (typeof context !== 'object') {
    return internalServerError('Authorizer response context must be an object')
  }

  if (!isValidContext(context)) {
    const error =
      'Authorizer response context values must be of type string, number, or boolean'

    serverlessLog(
      `Detected invalid value types returned in authorizer context: (λ: ${authFunName}). ${error}. ` +
        'More info: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html',
    )

    return internalServerError(error)
  }

  return transform(context)
}
