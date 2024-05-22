function generatePolicy(principalId, effect, resource) {
  const authResponse = {
    principalId,
  }

  if (effect && resource) {
    authResponse.policyDocument = {
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
      Version: "2012-10-17",
    }
  }
  return authResponse
}

function generateSimpleResponse(authorizedValue) {
  return {
    isAuthorized: authorizedValue,
  }
}

function parseIdentitySourceToken(source) {
  if (source.includes("Bearer")) {
    const [, credential] = source.split(" ")
    return credential
  }

  return source
}

// On version 1.0, identitySource is a string
export async function requestAuthorizer1Format(event) {
  const credential = parseIdentitySourceToken(event.identitySource)

  if (credential === "fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a") {
    return generatePolicy("user123", "Allow", event.methodArn)
  }

  if (credential === "fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b") {
    return generatePolicy("user123", "Deny", event.methodArn)
  }

  throw new Error("Unauthorized")
}

// On version 2.0, identitySource is a string array
export async function requestAuthorizer2Format(event) {
  const credential = parseIdentitySourceToken(event.identitySource[0])

  if (credential === "fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a") {
    return generatePolicy("user123", "Allow", event.routeArn)
  }

  if (credential === "fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b") {
    return generatePolicy("user123", "Deny", event.routeArn)
  }

  throw new Error("Unauthorized")
}

// On version 2.0, Simple responses do not require generating a policy. you can respond with a boolean object
// https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html
// In this case, AWS doesn't care about the principal.
export async function requestAuthorizer2FormatSimple(event) {
  const credential = parseIdentitySourceToken(event.identitySource[0])

  if (credential === "fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5a") {
    return generateSimpleResponse(true)
  }

  if (credential === "fc3e55ea-e6ec-4bf2-94d2-06ae6efe6e5b") {
    return generateSimpleResponse(false)
  }

  throw new Error("Unauthorized")
}
