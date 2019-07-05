'use strict';

const { Duration } = require('luxon');
const formatToClfTime = require('../formatToClfTime.js');

const { fromObject } = Duration;

describe('formatToClfTime', () => {
  test('should return clf formatted time', () => {
    const date = new Date(1995, 11, 17, 3, 24, 0);
    const offset = date.getTimezoneOffset();
    const formattedOffset = fromObject({ minutes: offset }).toFormat('hhmm');
    const expected = `17/Dec/1995:03:24:00 -${formattedOffset}`;

    const result = formatToClfTime(date);
    expect(result).toEqual(expected);
  });
});
