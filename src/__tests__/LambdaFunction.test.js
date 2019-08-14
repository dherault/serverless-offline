'use strict'

const { resolve } = require('path')
const LambdaFunction = require('../LambdaFunction.js')
const { DEFAULT_LAMBDA_TIMEOUT } = require('../config/index.js')

describe('LambdaFunction', () => {
  const functionName = 'foo'
  const provider = {
    runtime: 'nodejs10.x',
  }

  const config = {
    servicePath: resolve(__dirname),
    serverlessPath: '',
  }

  describe('Handler tests', () => {
    ;[
      {
        description: 'should return result when handler is context.done',
        expected: 'foo',
        handler: 'fixtures/lambdaFunction.fixture.contextDoneHandler',
      },
      {
        description:
          'should return result when handler is context.done which is deferred',
        expected: 'foo',
        handler: 'fixtures/lambdaFunction.fixture.contextDoneHandlerDeferred',
      },
      {
        description: 'should return result when handler is context.succeed',
        expected: 'foo',
        handler: 'fixtures/lambdaFunction.fixture.contextSucceedHandler',
      },
      {
        description:
          'should return result when handler is context.succeed which is deferred',
        expected: 'foo',
        handler:
          'fixtures/lambdaFunction.fixture.contextSucceedHandlerDeferred',
      },
      {
        description: 'should return result when handler is a callback',
        expected: 'foo',
        handler: 'fixtures/lambdaFunction.fixture.callbackHandler',
      },
      {
        description:
          'should return result when handler is a callback which is deferred',
        expected: 'foo',
        handler: 'fixtures/lambdaFunction.fixture.callbackHandlerDeferred',
      },
      {
        description: 'should return result when handler returns a promise',
        expected: 'foo',
        handler: 'fixtures/lambdaFunction.fixture.promiseHandler',
      },
      {
        description:
          'should return result when handler returns a promise which is deferred',
        expected: 'foo',
        handler: 'fixtures/lambdaFunction.fixture.promiseHandlerDeferred',
      },
      {
        description: 'should return result when handler is an async function',
        expected: 'foo',
        handler: 'fixtures/lambdaFunction.fixture.asyncFunctionHandler',
      },
      // NOTE: mix and matching of callbacks and promises is not recommended,
      // nonetheless, we test some of the behaviour to match AWS execution precedence
      {
        description:
          'should return result when handler returns a callback but defines a callback parameter',
        expected: 'Hello Promise!',
        handler:
          'fixtures/lambdaFunction.fixture.promiseWithDefinedCallbackHandler',
      },
      {
        description:
          'should return result when handler calls context.succeed and context.done',
        expected: 'Hello Context.succeed!',
        handler:
          'fixtures/lambdaFunction.fixture.contextSucceedWithContextDoneHandler',
      },
      {
        description:
          'should return result when handler calls callback and context.done',
        expected: 'Hello Callback!',
        handler:
          'fixtures/lambdaFunction.fixture.callbackWithContextDoneHandler',
      },
      {
        description:
          'should return result when handler calls callback and returns Promise',
        expected: 'Hello Callback!',
        handler: 'fixtures/lambdaFunction.fixture.callbackWithPromiseHandler',
      },
      {
        description:
          'should return result when handler calls callback inside returned Promise',
        expected: 'Hello Callback!',
        handler: 'fixtures/lambdaFunction.fixture.callbackInsidePromiseHandler',
      },
    ].forEach(({ description, expected, handler }) => {
      test(description, async () => {
        const functionObj = {
          handler,
        }
        const options = {}
        const lambdaFunction = new LambdaFunction(
          functionName,
          functionObj,
          provider,
          config,
          options,
        )
        const result = await lambdaFunction.runHandler()

        expect(result).toEqual(expected)
      })
    })
  })

  // we test both (return and context passing), since id is generated
  test('getAwsRequestId should return requestId and should also pass requestId to LambdaContext', async () => {
    const functionObj = {
      handler: 'fixtures/lambdaFunction.fixture.requestIdHandler',
    }
    const options = {}
    const lambdaFunction = new LambdaFunction(
      functionName,
      functionObj,
      provider,
      config,
      options,
    )
    const result = await lambdaFunction.runHandler()
    const requestId = lambdaFunction.getAwsRequestId()

    expect(requestId).toEqual(result)
  })

  test('should pass remaining time to LambdaContext', async () => {
    const functionObj = {
      handler: 'fixtures/lambdaFunction.fixture.remainingExecutionTimeHandler',
    }
    const options = {}
    const lambdaFunction = new LambdaFunction(
      functionName,
      functionObj,
      provider,
      config,
      options,
    )
    const [first, second, third] = await lambdaFunction.runHandler()

    // handler "pauses" for 100 ms
    expect(first).toBeGreaterThan(second - 100)
    expect(second).toBeGreaterThan(third - 200)
  })

  // might run flaky (unreliable)
  test('should use default lambda timeout when timeout is not provided', async () => {
    const functionObj = {
      handler: 'fixtures/lambdaFunction.fixture.defaultTimeoutHandler',
    }
    const options = {}
    const lambdaFunction = new LambdaFunction(
      functionName,
      functionObj,
      provider,
      config,
      options,
    )
    const remainingTime = await lambdaFunction.runHandler()

    // result might be flaky/unreliable:
    // (assmuning handler runs no longer than 100 ms)
    expect(DEFAULT_LAMBDA_TIMEOUT * 1000).toBeLessThanOrEqual(
      remainingTime + 100,
    )
  })

  // might run flaky (unreliable)
  test('getExecutionTimeInMillis should return execution time', async () => {
    const functionObj = {
      handler:
        'fixtures/lambdaFunction.fixture.getExecutionTimeInMillisHandler',
    }
    const options = {}
    const lambdaFunction = new LambdaFunction(
      functionName,
      functionObj,
      provider,
      config,
      options,
    )
    const timerStart = new Date().getTime()
    await lambdaFunction.runHandler()
    const timerEnd = new Date().getTime()
    const executionTime = lambdaFunction.getExecutionTimeInMillis()

    expect(timerEnd - timerStart).toBeGreaterThanOrEqual(executionTime - 100)
  })
})
