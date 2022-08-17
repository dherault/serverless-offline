import assert from 'node:assert'
import formatToClfTime from '../formatToClfTime.js'

const { now } = Date

describe('formatToClfTime', () => {
  it('should return "common log format" formatted time', () => {
    const millis = now()
    const result = formatToClfTime(millis)

    // expected: 17/Dec/1995:03:24:00 -0500 (with varying offset)
    assert.match(result, /([\w:/]+\s[+-]\d{4})/)
  })
})
