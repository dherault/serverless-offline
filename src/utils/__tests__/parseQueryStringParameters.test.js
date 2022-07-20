import assert from 'node:assert'
// uses the same tests as parseMultiValueQueryStringParameters
import parseQueryStringParameters from '../parseQueryStringParameters.js'
import tests from './tests/parseQueryStringParameters.js'

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    const url = `/foo?${param}`

    it(`should return ${description}`, () => {
      const result = parseQueryStringParameters(url)
      assert.deepEqual(result, expected)
    })
  })
})
