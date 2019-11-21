'use strict'

function generatePolicy(principalId, effect, resource) {
  const authResponse = {
    principalId,
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
    // callback(null, generatePolicy('user123', 'Allow', event.methodArn))
    // return
    return generatePolicy('user123', 'Allow', event.methodArn)
  }

  if (credential === '4674cc54-bd05-11e7-abc4-cec278b6b50b') {
    // callback(null, generatePolicy('user123', 'Deny', event.methodArn))
    // return
    return generatePolicy('user123', 'Deny', event.methodArn)
  }

  // callback('Unauthorized')
  throw 'Unauthorized'
}
