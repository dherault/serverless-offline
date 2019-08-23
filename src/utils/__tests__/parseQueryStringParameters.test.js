'use strict'

// uses the same tests as parseMultiValueQueryStringParameters
const tests = require('./parseMultiValueQueryStringParameters.test.js')
const parseQueryStringParameters = require('../parseQueryStringParameters.js')

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    const url = `/foo?${param}`

    test(`should return ${description}`, () => {
      const result = parseQueryStringParameters(url)
      expect(result).toEqual(expected)
    })
  })
})
