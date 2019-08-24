'use strict'

const parseMultiValueHeaders = require('../parseMultiValueHeaders.js')

// TODO need more tests
const tests = [
  {
    description: 'no parameter (empty array)',
    expected: null,
    expectedMulti: null,
    param: [],
  },
]

describe('parseMultiValueHeaders', () => {
  tests.forEach(({ description, expectedMulti, param }) => {
    test(`should return ${description}`, () => {
      const resultMulti = parseMultiValueHeaders(param)
      expect(resultMulti).toEqual(expectedMulti)
    })
  })
})

// export tests for parseHeaders
module.exports = tests
