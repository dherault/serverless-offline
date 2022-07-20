import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
// import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'
import LambdaFunction from '../LambdaFunction.js'
import { DEFAULT_LAMBDA_TIMEOUT } from '../../config/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('LambdaFunction', () => {
  const functionName = 'foo'

  const serverless = {
    config: {
      serverlessPath: '',
      servicePath: resolve(__dirname),
    },
    service: {
      provider: {
        runtime: 'nodejs12.x',
      },
    },
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
      it(description, async () => {
        const functionDefinition = {
          handler,
        }
        const options = {}
        const lambdaFunction = new LambdaFunction(
          functionName,
          functionDefinition,
          serverless,
          options,
        )
        const result = await lambdaFunction.runHandler()

        await lambdaFunction.cleanup()

        assert.equal(result, expected)
      })
    })
  })

  it('should pass remaining time to LambdaContext', async () => {
    const functionDefinition = {
      handler: 'fixtures/lambdaFunction.fixture.remainingExecutionTimeHandler',
    }
    const options = {}
    const lambdaFunction = new LambdaFunction(
      functionName,
      functionDefinition,
      serverless,
      options,
    )
    const [first, second, third] = await lambdaFunction.runHandler()

    await lambdaFunction.cleanup()

    // handler "pauses" for 100 ms
    assert.ok(first > second - 100)
    assert.ok(second > third - 200)
  })

  it.skip('should use default lambda timeout when timeout is not provided', async () => {
    const functionDefinition = {
      handler: 'fixtures/lambdaFunction.fixture.defaultTimeoutHandler',
    }
    const options = {}
    const lambdaFunction = new LambdaFunction(
      functionName,
      functionDefinition,
      serverless,
      options,
    )
    const remainingTime = await lambdaFunction.runHandler()

    await lambdaFunction.cleanup()

    assert.ok(remainingTime < DEFAULT_LAMBDA_TIMEOUT * 1000)

    // result might be flaky/unreliable:
    // (assmuning handler runs no longer than 1 s)
    assert.ok(remainingTime + 1000 > DEFAULT_LAMBDA_TIMEOUT * 1000)
  })

  // // might run flaky (unreliable)
  // test('executionTimeInMillis should return execution time', async () => {
  //   const functionDefinition = {
  //     handler: 'fixtures/lambdaFunction.fixture.executionTimeInMillisHandler',
  //   }
  //   const options = {}
  //   const lambdaFunction = new LambdaFunction(
  //     functionName,
  //     functionDefinition,
  //     provider,
  //     config,
  //     options,
  //   )
  //   const timerStart = performance.now()
  //   await lambdaFunction.runHandler()
  //   const timerEnd = performance.now()
  //
  //   expect(lambdaFunction.executionTimeInMillis).toBeLessThanOrEqual(
  //     timerEnd - timerStart + 10,
  //   )
  // })
})
