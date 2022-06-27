import assert from 'node:assert'
import InvocationsController from '../../../routes/invocations/InvocationsController.js'
import LambdaFunctionThatReturnsJSONObject from '../../fixtures/Lambda/LambdaFunctionThatReturnsJSONObject.fixture.js'
import LambdaFunctionThatReturnsNativeString from '../../fixtures/Lambda/LambdaFunctionThatReturnsNativeString.fixture.js'

describe('InvocationController', () => {
  const functionName = 'foo'

  describe('when event type is "RequestResponse"', () => {
    const eventType = 'RequestResponse'

    it('should return json object if lambda response is json', async () => {
      const expected = {
        Payload: {
          foo: 'bar',
        },
        StatusCode: 200,
      }

      const lambdaFunction = new LambdaFunctionThatReturnsJSONObject()
      const invocationController = new InvocationsController(lambdaFunction)
      const result = await invocationController.invoke(functionName, eventType)
      await lambdaFunction.cleanup()

      assert.deepEqual(result, expected)
    })

    it('should wrap native string responses with ""', async () => {
      const expected = {
        Payload: '"foo"',
        StatusCode: 200,
      }

      const lambdaFunction = new LambdaFunctionThatReturnsNativeString()
      const invocationController = new InvocationsController(lambdaFunction)
      const result = await invocationController.invoke(functionName, eventType)
      await lambdaFunction.cleanup()

      assert.deepEqual(result, expected)
    })
  })
})
