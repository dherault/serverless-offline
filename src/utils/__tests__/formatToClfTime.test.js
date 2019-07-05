'use strict';

const formatToClfTime = require('../formatToClfTime.js');

describe('formatToClfTime', () => {
  test('should return "common log format" formatted time', () => {
    const date = new Date(1995, 11, 17, 3, 24, 0);
    // expected: 17/Dec/1995:03:24:00 -0500 (with varying offset)
    const result = formatToClfTime(date);

    expect(result).toEqual(expect.stringMatching(/([\w:/]+\s[+-]\d{4})/));
  });
});
