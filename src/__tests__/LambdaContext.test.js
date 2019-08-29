'use strict'

const LambdaContext = require('../LambdaContext.js')

describe('LambdaContext', () => {
  test('should create LambdaContext with correct values', () => {
    const config = {
      requestId: 'abc123',
      lambdaName: 'foo',
      memorySize: 512,
    }

    const lambdaContext = new LambdaContext(config)
    const context = lambdaContext.create()

    const expected = {
      // getter/setter
      callbackWaitsForEmptyEventLoop: undefined, // TODO FIXME

      // properties
      awsRequestId: `abc123`,
      clientContext: {},
      functionName: 'foo',
      functionVersion: `$LATEST`,
      identity: {},
      invokedFunctionArn: `offline_invokedFunctionArn_for_foo`,
      logGroupName: `offline_logGroupName_for_foo`,
      logStreamName: `offline_logStreamName_for_foo`,
      memoryLimitInMB: '512',
    }

    expect(context).toEqual(expected)
  })
})
