import parseMultiValueQueryStringParameters from '../parseMultiValueQueryStringParameters.js'
import tests from './tests/parseQueryStringParameters.js'

describe('parseMultiValueQueryStringParameters', () => {
  tests.forEach(({ description, expectedMulti, param }) => {
    const url = `foo?${param}`

    test(`should return ${description}`, () => {
      const resultMulti = parseMultiValueQueryStringParameters(url)
      expect(resultMulti).toEqual(expectedMulti)
    })
  })
})

// export tests for parseQueryStringParameters
export default tests
