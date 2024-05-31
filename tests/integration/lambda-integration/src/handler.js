const { stringify } = JSON

export async function lambdaIntegrationJson() {
  return {
    foo: "bar",
  }
}

export async function lambdaIntegrationJsonWithBody() {
  return {
    body: {
      foo: "bar",
    },
    statusCode: 200,
  }
}

export async function lambdaIntegrationStringified() {
  return stringify({
    foo: "bar",
  })
}

export async function lambdaIntegrationWithOperationName(event) {
  return {
    body: stringify({
      operationName: event.requestContext.operationName,
    }),
    statusCode: 200,
  }
}
