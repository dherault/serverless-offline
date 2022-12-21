import assert from 'node:assert'
import parseMultiValueHeaders from '../parseMultiValueHeaders.js'

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
    it(`should return ${description}`, () => {
      const resultMulti = parseMultiValueHeaders(param)
      assert.deepEqual(resultMulti, expectedMulti)
    })
  })
})

// export tests for parseHeaders
export default tests
