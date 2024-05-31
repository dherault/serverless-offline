function generatePolicy(principalId, effect, resource) {
  const authResponse = {
    principalId,
  }

  if (effect && resource) {
    const policyDocument = {
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
      Version: "2012-10-17",
    }

    authResponse.policyDocument = policyDocument
    authResponse.context = {
      example: "Example value",
    }
  }
  return authResponse
}

export async function authorizerAsyncFunction(event) {
  const credential = event.queryStringParameters
    ? event.queryStringParameters.credential
    : undefined

  if (credential === "isValid") {
    return generatePolicy("user123", "Allow", event.methodArn)
  }

  if (credential === "isNotValid") {
    return generatePolicy("user123", "Deny", event.methodArn)
  }

  if (credential === "noContext") {
    const policy = generatePolicy("user123", "Allow", event.methodArn)
    delete policy.context
    return policy
  }

  if (credential === "exception") {
    throw new Error("Failed")
  }

  return "Unauthorized"
}
