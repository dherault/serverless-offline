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

exports.authorizerAsyncFunction = async function authorizerAsyncFunction(
  event,
) {
  const credential = event.queryStringParameters
    ? event.queryStringParameters.credential
    : undefined

  if (credential === 'isValid') {
    return generatePolicy('user123', 'Allow', event.methodArn)
  }

  if (credential === 'isNotValid') {
    return generatePolicy('user123', 'Deny', event.methodArn)
  }

  if (credential === 'exception') {
    throw new Error('Failed')
  }

  return 'Unauthorized'
}
