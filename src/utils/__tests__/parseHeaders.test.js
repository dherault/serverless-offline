import assert from 'node:assert'
// uses the same tests as parseMultiValueHeaders
import tests from './parseMultiValueHeaders.test.js'
import parseHeaders from '../parseHeaders.js'

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    it(`should return ${description}`, () => {
      const result = parseHeaders(param)
      assert.deepEqual(result, expected)
    })
  })
})
