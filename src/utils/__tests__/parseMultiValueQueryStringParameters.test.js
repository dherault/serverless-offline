import assert from 'node:assert'
import parseMultiValueQueryStringParameters from '../parseMultiValueQueryStringParameters.js'
import tests from './tests/parseQueryStringParameters.js'

describe('parseMultiValueQueryStringParameters', () => {
  tests.forEach(({ description, expectedMulti, param }) => {
    const url = `foo?${param}`

    it(`should return ${description}`, () => {
      const resultMulti = parseMultiValueQueryStringParameters(url)
      assert.deepEqual(resultMulti, expectedMulti)
    })
  })
})

// export tests for parseQueryStringParameters
export default tests
