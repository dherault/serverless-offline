// uses the same tests as parseMultiValueQueryStringParameters
import parseQueryStringParameters from '../parseQueryStringParameters.js'
import tests from './tests/parseQueryStringParameters.js'

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    const url = `/foo?${param}`

    test(`should return ${description}`, () => {
      const result = parseQueryStringParameters(url)
      expect(result).toEqual(expected)
    })
  })
})
