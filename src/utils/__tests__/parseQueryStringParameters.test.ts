// uses the same tests as parseMultiValueQueryStringParameters
import tests from './parseMultiValueQueryStringParameters.test'
import parseQueryStringParameters from '../parseQueryStringParameters'

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    const url = `/foo?${param}`

    test(`should return ${description}`, () => {
      const result = parseQueryStringParameters(url)
      expect(result).toEqual(expected)
    })
  })
})
