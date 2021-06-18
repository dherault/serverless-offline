import getHandlerName from '../getHandlerName.js'

const tests = [
  {
    input: {
      image: {
        command: ['app.handler'],
        name: 'node14',
      },
      events: [
        {
          httpApi: {
            method: 'get',
            path: '/',
          },
        },
      ],
    },
    expected: 'app.handler',
  },
  {
    input: {
      handler: 'app.handler',
      events: [
        {
          httpApi: {
            method: 'get',
            path: '/',
          },
        },
      ],
    },
    expected: 'app.handler',
  },
]

describe('getHandlerName', () => {
  tests.forEach(({ input, expected }) => {
    test('Should return the correct handler name', () => {
      const handlerValue = getHandlerName(input)
      expect(handlerValue).toEqual(expected)
    })
  })
})
