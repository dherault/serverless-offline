'use strict';

const { resolve } = require('path');
const LambdaFunction = require('../LambdaFunction.js');
const { DEFAULT_LAMBDA_TIMEOUT } = require('../config/index.js');

describe('LambdaFunction', () => {
  const functionName = 'foo';
  const handlerPath = resolve(
    __dirname,
    './fixtures/lambdaFunction.fixture.js',
  );
  const runtime = 'nodejs10.x';

  describe('Handler tests', () => {
    [
      {
        description: 'should return result when handler is context.done',
        expected: 'foo',
        handlerName: 'contextDoneHandler',
      },
      {
        description:
          'should return result when handler is context.done which is deferred',
        expected: 'foo',
        handlerName: 'contextDoneHandlerDeferred',
      },
      {
        description: 'should return result when handler is context.succeed',
        expected: 'foo',
        handlerName: 'contextSucceedHandler',
      },
      {
        description:
          'should return result when handler is context.succeed which is deferred',
        expected: 'foo',
        handlerName: 'contextSucceedHandlerDeferred',
      },
      {
        description: 'should return result when handler is a callback',
        expected: 'foo',
        handlerName: 'callbackHandler',
      },
      {
        description:
          'should return result when handler is a callback which is deferred',
        expected: 'foo',
        handlerName: 'callbackHandlerDeferred',
      },
      {
        description: 'should return result when handler returns a promise',
        expected: 'foo',
        handlerName: 'promiseHandler',
      },
      {
        description:
          'should return result when handler returns a promise which is deferred',
        expected: 'foo',
        handlerName: 'promiseHandlerDeferred',
      },
      {
        description: 'should return result when handler is an async function',
        expected: 'foo',
        handlerName: 'asyncFunctionHandler',
      },
      // NOTE: mix and matching of callbacks and promises is not recommended,
      // nonetheless, we test some of the behaviour to match AWS execution precedence
      {
        description:
          'should return result when handler returns a callback but defines a callback parameter',
        expected: 'Hello Promise!',
        handlerName: 'promiseWithDefinedCallbackHandler',
      },
      {
        description:
          'should return result when handler calls context.succeed and context.done',
        expected: 'Hello Context.succeed!',
        handlerName: 'contextSucceedWithContextDoneHandler',
      },
      {
        description:
          'should return result when handler calls callback and context.done',
        expected: 'Hello Callback!',
        handlerName: 'callbackWithContextDoneHandler',
      },
      {
        description:
          'should return result when handler calls callback and returns Promise',
        expected: 'Hello Callback!',
        handlerName: 'callbackWithPromiseHandler',
      },
      {
        description:
          'should return result when handler calls callback inside returned Promise',
        expected: 'Hello Callback!',
        handlerName: 'callbackInsidePromiseHandler',
      },
    ].forEach(({ description, expected, handlerName }) => {
      test(description, async () => {
        const config = {
          functionName,
          handlerName,
          handlerPath,
          runtime,
        };
        const options = {};
        const lambdaFunction = new LambdaFunction(config, options);
        const result = await lambdaFunction.runHandler();

        expect(result).toEqual(expected);
      });
    });
  });

  // we test both (return and context passing), since id is generated
  test('getAwsRequestId should return requestId and should also pass requestId to LambdaContext', async () => {
    const config = {
      functionName,
      handlerName: 'requestIdHandler',
      handlerPath,
      runtime,
    };
    const options = {};
    const lambdaFunction = new LambdaFunction(config, options);
    const result = await lambdaFunction.runHandler();
    const requestId = lambdaFunction.getAwsRequestId();

    expect(requestId).toEqual(result);
  });

  test('should pass remaining time to LambdaContext', async () => {
    const config = {
      functionName,
      handlerName: 'remainingExecutionTimeHandler',
      handlerPath,
      runtime,
    };
    const options = {};
    const lambdaFunction = new LambdaFunction(config, options);
    const [first, second, third] = await lambdaFunction.runHandler();

    // handler "pauses" for 100 ms
    expect(first).toBeGreaterThan(second - 100);
    expect(second).toBeGreaterThan(third - 200);
  });

  // might run flaky (unreliable)
  test('should use default lambda timeout when timeout is not provided', async () => {
    const config = {
      functionName,
      handlerName: 'defaultTimeoutHandler',
      handlerPath,
      runtime,
    };
    const options = {};
    const lambdaFunction = new LambdaFunction(config, options);
    const remainingTime = await lambdaFunction.runHandler();

    // result might be flaky/unreliable:
    // (assmuning handler runs no longer than 100 ms)
    expect(DEFAULT_LAMBDA_TIMEOUT * 1000).toBeLessThanOrEqual(
      remainingTime + 100,
    );
  });

  // might run flaky (unreliable)
  test('getExecutionTimeInMillis should return execution time', async () => {
    const config = {
      functionName,
      handlerName: 'getExecutionTimeInMillisHandler',
      handlerPath,
      runtime,
    };
    const options = {};
    const lambdaFunction = new LambdaFunction(config, options);
    const timerStart = new Date().getTime();
    await lambdaFunction.runHandler();
    const timerEnd = new Date().getTime();
    const executionTime = lambdaFunction.getExecutionTimeInMillis();

    expect(timerEnd - timerStart).toBeGreaterThanOrEqual(executionTime - 100);
  });
});
