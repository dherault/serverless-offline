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

// On version 1.0, identitySource is a string
export async function requestAuthorizer1Format(event) {
  const [, credential] = event.identitySource.split(' ')

  if (credential === 'fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a') {
    return generatePolicy('user123', 'Allow', event.methodArn)
  }

  if (credential === 'fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b') {
    return generatePolicy('user123', 'Deny', event.methodArn)
  }

  throw new Error('Unauthorized')
}

// On version 2.0, identitySource is a string array
export async function requestAuthorizer2Format(event) {
  const [, credential] = event.identitySource[0].split(' ')

  if (credential === 'fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a') {
    return generatePolicy('user123', 'Allow', event.routeArn)
  }

  if (credential === 'fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b') {
    return generatePolicy('user123', 'Deny', event.routeArn)
  }

  throw new Error('Unauthorized')
}
