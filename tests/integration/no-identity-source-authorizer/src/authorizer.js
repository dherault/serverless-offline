export async function authorizer(event) {
  return {
    policyDocument: {
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        },
      ],
      Version: '2012-10-17',
    },
    principalId: 'user',
  }
}
