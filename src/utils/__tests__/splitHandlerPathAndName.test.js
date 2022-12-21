import assert from 'node:assert'
import splitHandlerPathAndName from '../splitHandlerPathAndName.js'

const tests = [
  {
    description: 'ruby handler with namespace resolution operator ::',
    expected: ['./src/somefolder/source', 'LambdaFunctions::Handler.process'],
    handler: './src/somefolder/source.LambdaFunctions::Handler.process',
  },
  {
    description: 'ruby handler with multiple namespace resolution operators ::',
    expected: [
      './src/somefolder/source',
      'Functions::LambdaFunctions::Handler.process',
    ],
    handler:
      './src/somefolder/source.Functions::LambdaFunctions::Handler.process',
  },
  {
    description: 'ruby handler with namespace resolution operator ::, unnested',
    expected: ['source', 'LambdaFunctions::Handler.process'],
    handler: 'source.LambdaFunctions::Handler.process',
  },
  {
    description:
      'ruby handler with multiple namespace resolution operators ::, unnested',
    expected: ['./source', 'Functions::LambdaFunctions::Handler.process'],
    handler: './source.Functions::LambdaFunctions::Handler.process',
  },
  {
    description: 'ruby handler from kernel',
    expected: ['./src/somefolder/function', 'handler'],
    handler: './src/somefolder/function.handler',
  },
  {
    description: 'generic handler',
    expected: ['./src/somefolder/.handlers/handler', 'run'],
    handler: './src/somefolder/.handlers/handler.run',
  },
  {
    description: 'generic handler, unnested',
    expected: ['handler', 'run'],
    handler: 'handler.run',
  },
]

describe('splitHandlerPathAndName', () => {
  tests.forEach(({ description, expected, handler }) => {
    it(`should split ${description}`, () => {
      const result = splitHandlerPathAndName(handler)
      assert.deepEqual(result, expected)
    })
  })
})
