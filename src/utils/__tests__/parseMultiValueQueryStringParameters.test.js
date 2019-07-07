'use strict';

const { URL } = require('url');

const parseMultiValueQueryStringParameters = require('../parseMultiValueQueryStringParameters.js');

const tests = [
  {
    description: 'no parameter (empty string)',
    param: '',
    expected: null,
    expectedMulti: null,
  },

  {
    description: 'string parameter',
    param: 'foo=bar',
    expected: { foo: 'bar' },
    expectedMulti: { foo: ['bar'] },
  },

  {
    description: 'number parameter (no type casting)',
    param: 'foo=1',
    expected: { foo: '1' },
    expectedMulti: { foo: ['1'] },
  },

  {
    description: 'boolean parameter (no type casting)',
    param: 'foo=true',
    expected: { foo: 'true' },
    expectedMulti: { foo: ['true'] },
  },

  {
    description: 'multiple parameters',
    param: 'foo=test1&bar=test2',
    expected: { foo: 'test1', bar: 'test2' },
    expectedMulti: { foo: ['test1'], bar: ['test2'] },
  },

  {
    description: 'multiple parameters, same keys',
    param: 'foo=test&foo=foobar',
    expected: { foo: 'foobar' },
    expectedMulti: { foo: ['test', 'foobar'] },
  },

  {
    description: 'multiple parameters, same keys, different casing',
    param: 'foo=test&FOO=FOOBAR',
    expected: { foo: 'test', FOO: 'FOOBAR' },
    expectedMulti: { foo: ['test'], FOO: ['FOOBAR'] },
  },

  {
    description: 'multiple parameters, same keys, same values',
    param: 'foo=test&foo=test',
    expected: { foo: 'test' },
    expectedMulti: { foo: ['test', 'test'] },
  },

  {
    description: 'no value',
    param: 'foo',
    expected: { foo: '' },
    expectedMulti: { foo: [''] },
  },

  {
    description: 'no value with =',
    param: 'foo=',
    expected: { foo: '' },
    expectedMulti: { foo: [''] },
  },

  {
    description: 'no value with &',
    param: 'foo&',
    expected: { foo: '' },
    expectedMulti: { foo: [''] },
  },

  {
    description: 'no value with = and &',
    param: 'foo=&',
    expected: { foo: '' },
    expectedMulti: { foo: [''] },
  },

  {
    description: 'value is whitespace',
    param: 'foo=%20',
    expected: { foo: ' ' },
    expectedMulti: { foo: [' '] },
  },

  {
    description: 'key and value have whitespace',
    param: '%20foo%20=%20test%20',
    expected: { ' foo ': ' test ' },
    expectedMulti: { ' foo ': [' test '] },
  },

  {
    description: 'unicode',
    param: 'Σ=😋',
    expected: { Σ: '😋' },
    expectedMulti: { Σ: ['😋'] },
  },

  {
    description: 'encoded', // encodeURIComponent
    param: '%3F%3D%2F%26%3A=%3F%3D%2F%26%3A',
    expected: { '?=/&:': '?=/&:' },
    expectedMulti: { '?=/&:': ['?=/&:'] },
  },

  {
    description: 'end of line',
    param: '%0A=%0A',
    expected: { '\n': '\n' },
    expectedMulti: { '\n': ['\n'] },
  },

  // silly test section:
  {
    description: 'silly I.',
    param: 'test=?',
    expected: { test: '?' },
    expectedMulti: { test: ['?'] },
  },

  {
    description: 'silly II.',
    param: 'test=/',
    expected: { test: '/' },
    expectedMulti: { test: ['/'] },
  },

  {
    description: 'silly III.',
    param: 'test==',
    expected: { test: '=' },
    expectedMulti: { test: ['='] },
  },
];

describe('parseMultiValueQueryStringParameters', () => {
  tests.forEach(({ description, param, expectedMulti }) => {
    const url = `https://foo.com/?${param}`;
    const { searchParams } = new URL(url);

    test(`should return ${description}`, () => {
      const resultMulti = parseMultiValueQueryStringParameters(searchParams);
      expect(resultMulti).toEqual(expectedMulti);
    });
  });
});

// export tests for parseQueryStringParameters
module.exports = tests;
