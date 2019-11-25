import parseMultiValueHeaders from '../parseMultiValueHeaders'

// TODO need more tests
const tests = [
  {
    description: 'no parameter (empty array)',
    expected: null,
    expectedMulti: null,
    param: [],
  },
]

describe('parseMultiValueHeaders', () => {
  tests.forEach(({ description, expectedMulti, param }) => {
    test(`should return ${description}`, () => {
      const resultMulti = parseMultiValueHeaders(param)
      expect(resultMulti).toEqual(expectedMulti)
    })
  })
})

// export tests for parseHeaders
export default tests
