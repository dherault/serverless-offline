// uses the same tests as parseMultiValueQueryStringParameters
import tests from './parseMultiValueQueryStringParameters.test.js'
import parseQueryStringParameters from '../parseQueryStringParameters.js'

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    const url = `/foo?${param}`

    test(`should return ${description}`, () => {
      const result = parseQueryStringParameters(url)
      expect(result).toEqual(expected)
    })
  })
})
