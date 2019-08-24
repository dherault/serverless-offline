'use strict'

// uses the same tests as parseMultiValueHeaders
const tests = require('./parseMultiValueHeaders.test.js')
const parseHeaders = require('../parseHeaders.js')

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, expected, param }) => {
    test(`should return ${description}`, () => {
      const result = parseHeaders(param)
      expect(result).toEqual(expected)
    })
  })
})
