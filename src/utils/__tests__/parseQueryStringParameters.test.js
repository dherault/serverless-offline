'use strict';

const { URL } = require('url');

// uses the same tests as parseMultiValueQueryStringParameters
const tests = require('./parseMultiValueQueryStringParameters.test.js');
const parseQueryStringParameters = require('../parseQueryStringParameters.js');

describe('parseQueryStringParameters', () => {
  tests.forEach(({ description, param, expected }) => {
    const url = `https://foo.com/?${param}`;
    const { searchParams } = new URL(url);

    test(`should return ${description}`, () => {
      const result = parseQueryStringParameters(searchParams);
      expect(result).toEqual(expected);
    });
  });
});
