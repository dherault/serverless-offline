import { resolve } from 'path'
import LambdaFunction from '../../../LambdaFunction.js'

export default class LambdaFunctionThatReturnsNativeString {
  options = {}
  serverless = {
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

  listFunctionNames() {
    return ['foo']
  }

  getByFunctionName(functionName) {
    const functionDefinition = {
      handler: '../../fixtures/lambdaFunction.fixture.asyncFunctionHandler',
    }

    return new LambdaFunction(
      functionName,
      functionDefinition,
      this.serverless,
      this.options,
    )
  }
}
