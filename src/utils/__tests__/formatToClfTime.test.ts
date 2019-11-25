import formatToClfTime from '../formatToClfTime'

const { now } = Date

describe('formatToClfTime', () => {
  test('should return "common log format" formatted time', () => {
    const millis = now()
    const result = formatToClfTime(millis)

    // expected: 17/Dec/1995:03:24:00 -0500 (with varying offset)
    expect(result).toEqual(expect.stringMatching(/([\w:/]+\s[+-]\d{4})/))
  })
})
