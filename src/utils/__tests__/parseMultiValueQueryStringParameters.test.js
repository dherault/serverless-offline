import assert from 'node:assert'
import parseMultiValueQueryStringParameters from '../parseMultiValueQueryStringParameters.js'

const tests = [
  {
    description: 'no parameter (empty string)',
    expected: null,
    expectedMulti: null,
    param: '',
  },

  {
    description: 'string parameter',
    expected: { foo: 'bar' },
    expectedMulti: { foo: ['bar'] },
    param: 'foo=bar',
  },

  {
    description: 'number parameter (no type casting)',
    expected: { foo: '1' },
    expectedMulti: { foo: ['1'] },
    param: 'foo=1',
  },

  {
    description: 'boolean parameter (no type casting)',
    expected: { foo: 'true' },
    expectedMulti: { foo: ['true'] },
    param: 'foo=true',
  },

  {
    description: 'multiple parameters',
    expected: { bar: 'test2', foo: 'test1' },
    expectedMulti: { bar: ['test2'], foo: ['test1'] },
    param: 'foo=test1&bar=test2',
  },

  {
    description: 'multiple parameters, same keys',
    expected: { foo: 'foobar' },
    expectedMulti: { foo: ['test', 'foobar'] },
    param: 'foo=test&foo=foobar',
  },

  {
    description: 'multiple parameters, same keys, different casing',
    expected: { foo: 'test', FOO: 'FOOBAR' },
    expectedMulti: { foo: ['test'], FOO: ['FOOBAR'] },
    param: 'foo=test&FOO=FOOBAR',
  },

  {
    description: 'multiple parameters, same keys, same values',
    expected: { foo: 'test' },
    expectedMulti: { foo: ['test', 'test'] },
    param: 'foo=test&foo=test',
  },

  {
    description: 'no value',
    expected: { foo: '' },
    expectedMulti: { foo: [''] },
    param: 'foo',
  },

  {
    description: 'no value with =',
    expected: { foo: '' },
    expectedMulti: { foo: [''] },
    param: 'foo=',
  },

  {
    description: 'no value with &',
    expected: { foo: '' },
    expectedMulti: { foo: [''] },
    param: 'foo&',
  },

  {
    description: 'no value with = and &',
    expected: { foo: '' },
    expectedMulti: { foo: [''] },
    param: 'foo=&',
  },

  {
    description: 'value is whitespace',
    expected: { foo: ' ' },
    expectedMulti: { foo: [' '] },
    param: 'foo=%20',
  },

  {
    description: 'key and value have whitespace',
    expected: { ' foo ': ' test ' },
    expectedMulti: { ' foo ': [' test '] },
    param: '%20foo%20=%20test%20',
  },

  {
    description: 'unicode',
    expected: { Σ: '😋' },
    expectedMulti: { Σ: ['😋'] },
    param: 'Σ=😋',
  },

  {
    description: 'encoded', // encodeURIComponent
    expected: { '?=/&:': '?=/&:' },
    expectedMulti: { '?=/&:': ['?=/&:'] },
    param: '%3F%3D%2F%26%3A=%3F%3D%2F%26%3A',
  },

  {
    description: 'end of line',
    expected: { '\n': '\n' },
    expectedMulti: { '\n': ['\n'] },
    param: '%0A=%0A',
  },

  // silly test section:
  {
    description: 'silly I.',
    expected: { test: '?' },
    expectedMulti: { test: ['?'] },
    param: 'test=?',
  },

  {
    description: 'silly II.',
    expected: { test: '/' },
    expectedMulti: { test: ['/'] },
    param: 'test=/',
  },

  {
    description: 'silly III.',
    expected: { test: '=' },
    expectedMulti: { test: ['='] },
    param: 'test==',
  },
]

describe('parseMultiValueQueryStringParameters', () => {
  tests.forEach(({ description, expectedMulti, param }) => {
    const url = `foo?${param}`

    it(`should return ${description}`, () => {
      const resultMulti = parseMultiValueQueryStringParameters(url)
      assert.deepEqual(resultMulti, expectedMulti)
    })
  })
})

// export tests for parseQueryStringParameters
export default tests
