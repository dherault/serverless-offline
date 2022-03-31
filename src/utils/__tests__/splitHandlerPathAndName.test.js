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
    expected: ['./src/somefolder/function', 'handler', ['handler']],
    handler: './src/somefolder/function.handler',
  },
  {
    description: 'generic handler',
    expected: ['./src/somefolder/.handlers/handler', 'run', ['run']],
    handler: './src/somefolder/.handlers/handler.run',
  },
  {
    description: 'generic handler, unnested',
    expected: ['handler', 'run', ['run']],
    handler: 'handler.run',
  },
  {
    description: 'generic handler with module nesting',
    expected: [
      './src/somefolder/.handlers/handler',
      'run',
      ['layer1', 'layer2', 'run'],
    ],
    handler: './src/somefolder/.handlers/handler.layer1.layer2.run',
  },
  {
    description: 'generic handler, unnested with module nesting',
    expected: ['handler', 'run', ['layer1', 'layer2', 'run']],
    handler: 'handler.layer1.layer2.run',
  },
]

describe('splitHandlerPathAndName', () => {
  tests.forEach(({ description, expected, handler }) => {
    test(`should split ${description}`, () => {
      const result = splitHandlerPathAndName(handler)
      expect(result).toEqual(expected)
    })
  })
})
