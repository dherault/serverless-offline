// uses the same tests as parseMultiValueHeaders
import tests from './parseMultiValueHeaders.test'
import parseHeaders from '../parseHeaders'

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    test(`should return ${description}`, () => {
      const result = parseHeaders(param)
      expect(result).toEqual(expected)
    })
  })
})
