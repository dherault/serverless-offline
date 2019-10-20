import LambdaContext from '../LambdaContext.js'

describe('LambdaContext', () => {
  test('should create LambdaContext with correct values', () => {
    const functionName = 'foo'
    const memorySize = 512
    const requestId = 'abc123'

    const lambdaContext = new LambdaContext(functionName, memorySize)
    const context = lambdaContext.create(requestId)

    const expected = {
      awsRequestId: `abc123`,
      callbackWaitsForEmptyEventLoop: true,
      clientContext: undefined,
      functionName: 'foo',
      functionVersion: `$LATEST`,
      identity: undefined,
      invokedFunctionArn: `offline_invokedFunctionArn_for_foo`,
      logGroupName: `offline_logGroupName_for_foo`,
      logStreamName: `offline_logStreamName_for_foo`,
      memoryLimitInMB: '512',
    }

    expect(context).toEqual(expected)
  })
})
