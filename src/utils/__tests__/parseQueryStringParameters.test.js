import assert from 'node:assert'
// uses the same tests as parseMultiValueQueryStringParameters
import tests from './parseMultiValueQueryStringParameters.test.js'
import parseQueryStringParameters from '../parseQueryStringParameters.js'

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    const url = `/foo?${param}`

    it(`should return ${description}`, () => {
      const result = parseQueryStringParameters(url)
      assert.deepEqual(result, expected)
    })
  })
})
