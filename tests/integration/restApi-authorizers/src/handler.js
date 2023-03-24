const { stringify } = JSON

export const test = async () => {
  return {
    body: stringify({
      foo: 'bar',
    }),
    statusCode: 200,
  }
}

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

export const authorizerSingle = async (event) => {
  return generatePolicy('user123', 'Allow', event.methodArn, {})
}

export const authorizerMulti = async (event) => {
  return generatePolicy('user123', 'Allow', event.methodArn, {})
}
