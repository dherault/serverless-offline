'use strict'

function generatePolicy(principalId, effect, resource, context) {
  const authResponse = {
    principalId,
    context,
  }

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    }

    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

function generatePolicyWithContext(event, context) {
  return generatePolicy('user123', 'Allow', event.methodArn, context)
}

exports.authorizerCallback = async function authorizerCallback(
  event,
  context,
  callback,
) {
  const [, /* type */ credential] = event.authorizationToken.split(' ')

  if (credential === '4674cc54-bd05-11e7-abc4-cec278b6b50a') {
    callback(null, generatePolicy('user123', 'Allow', event.methodArn))
    return
  }

  if (credential === '4674cc54-bd05-11e7-abc4-cec278b6b50b') {
    callback(null, generatePolicy('user123', 'Deny', event.methodArn))
    return
  }

  callback('Unauthorized')
}

exports.authorizerAsyncFunction = async function authorizerAsyncFunction(
  event,
) {
  const [, /* type */ credential] = event.authorizationToken.split(' ')

  if (credential === '4674cc54-bd05-11e7-abc4-cec278b6b50a') {
    return generatePolicy('user123', 'Allow', event.methodArn)
  }

  if (credential === '4674cc54-bd05-11e7-abc4-cec278b6b50b') {
    return generatePolicy('user123', 'Deny', event.methodArn)
  }

  throw new Error('Unauthorized')
}

exports.authorizerWithContext = async function authorizerWithContext(event) {
  // Recommended format by AWS: string dictionary
  const recommendedContext = {
    stringKey: 'value',
    numberKey: '1',
    booleanKey: 'true',
  }

  // Still works, but values are coerced to strings
  const stringifiedContext = {
    stringKey: 'value',
    numberKey: 1,
    booleanKey: true,
  }

  // Causes AuthorizerConfigurationException
  const contextWithObjectKeys = {
    objectKey: { a: '1' },
    arrayKey: ['a', 'b', 'c'],
  }

  // Causes AuthorizerConfigurationException
  const contextNotAnObject = 'not an object'

  const [, /* type */ token] = event.authorizationToken.split(' ')

  switch (token) {
    case 'recommendedContext':
      return generatePolicyWithContext(event, recommendedContext)
    case 'stringifiedContext':
      return generatePolicyWithContext(event, stringifiedContext)
    case 'contextWithObjectKeys':
      return generatePolicyWithContext(event, contextWithObjectKeys)
    case 'contextNotAnObject':
      return generatePolicyWithContext(event, contextNotAnObject)
    default:
      throw new Error('Unauthorized')
  }
}
