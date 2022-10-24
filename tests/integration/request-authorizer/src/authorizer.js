function generatePolicy(principalId, effect, resource, context) {
  const authResponse = {
    context,
    principalId,
  }

  if (effect && resource) {
    const policyDocument = {
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
      Version: '2012-10-17',
    }

    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

export async function authorizerFunction(event, context, callback) {
  const [, /* type */ credential] = event.authorizationToken.split(' ')

  if (credential === 'fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a') {
    callback(null, generatePolicy('user123', 'Allow', event.methodArn))
    return
  }

  if (credential === 'fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b') {
    callback(null, generatePolicy('user123', 'Deny', event.methodArn))
    return
  }

  callback('Unauthorized')
}
