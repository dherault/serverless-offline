'use strict'

const LambdaContext = require('../LambdaContext.js')

describe('LambdaContext', () => {
  test('should create LambdaContext with correct values', () => {
    const config = {
      awsRequestId: 'abc123',
      getRemainingTimeInMillis() {},
      lambdaName: 'foo',
      memorySize: 512,
    }

    const lambdaContext = new LambdaContext(config)
    const context = lambdaContext.getContext()

    const expected = {
      // functions
      done: expect.any(Function),
      fail: expect.any(Function),
      getRemainingTimeInMillis: expect.any(Function),
      succeed: expect.any(Function),

      // properties
      awsRequestId: `abc123`,
      callbackWaitsForEmptyEventLoop: true,
      clientContext: {},
      functionName: 'foo',
      functionVersion: `offline_functionVersion_for_foo`,
      identity: {},
      invokedFunctionArn: `offline_invokedFunctionArn_for_foo`,
      logGroupName: `offline_logGroupName_for_foo`,
      logStreamName: `offline_logStreamName_for_foo`,
      memoryLimitInMB: 512,
    }

    expect(context).toEqual(expected)
  })

  test('should fire callback event when calling "done"', (done) => {
    const config = {
      getRemainingTimeInMillis() {},
      lambdaName: 'foo',
      memorySize: 512,
    }

    const lambdaContext = new LambdaContext(config)
    const testData = { foo: 'bar' }

    lambdaContext.once('contextCalled', (err, data) => {
      expect(data).toEqual(testData)
      expect(err).toEqual(null)
      done()
    })

    lambdaContext.getContext().done(null, testData)
  })

  test('should fire callback event when calling "succeed"', (done) => {
    const config = {
      getRemainingTimeInMillis() {},
      lambdaName: 'foo',
      memorySize: 512,
    }

    const lambdaContext = new LambdaContext(config)
    const testData = { foo: 'bar' }

    lambdaContext.once('contextCalled', (err, data) => {
      expect(data).toEqual(testData)
      expect(err).toEqual(null)
      done()
    })

    lambdaContext.getContext().succeed(testData)
  })

  test('should fire callback event when calling "fail"', (done) => {
    const config = {
      getRemainingTimeInMillis() {},
      lambdaName: 'foo',
      memorySize: 512,
    }

    const lambdaContext = new LambdaContext(config)
    const testError = new Error('foo')

    lambdaContext.once('contextCalled', (err, data) => {
      expect(data).toEqual(undefined)
      expect(err).toEqual(testError)
      done()
    })

    lambdaContext.getContext().fail(testError)
  })

  test('should return remaining time', () => {
    const time = 100
    const config = {
      getRemainingTimeInMillis: () => time,
      lambdaName: 'foo',
      memorySize: 512,
    }

    const lambdaContext = new LambdaContext(config)
    const timeRemaining = lambdaContext.getContext().getRemainingTimeInMillis()

    expect(timeRemaining).toEqual(time)
  })
})
