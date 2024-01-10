function generatePolicy(principalId, effect, resource, context) {
  const authResponse = {
    context,
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
  }
  return authResponse
}

function generatePolicyWithContext(event, context) {
  return generatePolicy("user123", "Allow", event.methodArn, context)
}

export function authorizerCallback(event, context, callback) {
  const [, /* type */ credential] = event.authorizationToken.split(" ")

  if (credential === "4674cc54-bd05-11e7-abc4-cec278b6b50a") {
    callback(null, generatePolicy("user123", "Allow", event.methodArn))
    return
  }

  if (credential === "4674cc54-bd05-11e7-abc4-cec278b6b50b") {
    callback(null, generatePolicy("user123", "Deny", event.methodArn))
    return
  }

  callback("Unauthorized")
}

export async function authorizerAsyncFunction(event) {
  const [, /* type */ credential] = event.authorizationToken.split(" ")

  if (credential === "4674cc54-bd05-11e7-abc4-cec278b6b50a") {
    return generatePolicy("user123", "Allow", event.methodArn)
  }

  if (credential === "4674cc54-bd05-11e7-abc4-cec278b6b50b") {
    return generatePolicy("user123", "Deny", event.methodArn)
  }

  throw new Error("Unauthorized")
}

export async function authorizerWithContext(event) {
  // Recommended format by AWS: string dictionary
  const recommendedContext = {
    booleanKey: "true",
    numberKey: "1",
    stringKey: "value",
  }

  // Still works, but values are coerced to strings
  const stringifiedContext = {
    booleanKey: true,
    numberKey: 1,
    stringKey: "value",
  }

  // Causes AuthorizerConfigurationException
  const contextWithObjectKeys = {
    arrayKey: ["a", "b", "c"],
    objectKey: { a: "1" },
  }

  // Causes AuthorizerConfigurationException
  const contextNotAnObject = "not an object"

  const [, /* type */ token] = event.authorizationToken.split(" ")

  switch (token) {
    case "recommendedContext": {
      return generatePolicyWithContext(event, recommendedContext)
    }
    case "stringifiedContext": {
      return generatePolicyWithContext(event, stringifiedContext)
    }
    case "contextWithObjectKeys": {
      return generatePolicyWithContext(event, contextWithObjectKeys)
    }
    case "contextNotAnObject": {
      return generatePolicyWithContext(event, contextNotAnObject)
    }
    default: {
      throw new Error("Unauthorized")
    }
  }
}
