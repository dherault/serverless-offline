'use strict';

const parseQueryParameters = require('../parseQueryParameters.js');

describe('parseQueryParameters', () => {
  test.each`
    param                                    | expected                        | description
    ${''}                                    | ${{}}                           | ${''}
    ${'test=foo'}                            | ${{ test: 'foo' }}              | ${'string parameter'}
    ${'test=1'}                              | ${{ test: '1' }}                | ${'number parameter'}
    ${'test=true'}                           | ${{ test: 'true' }}             | ${'boolean parameter'}
    ${'foo=test&bar=test'}                   | ${{ foo: 'test', bar: 'test' }} | ${'multiple parameters'}
    ${'foo=test&foo=foobar'}                 | ${{ foo: 'foobar' }}            | ${'multiple same keys'}
    ${'foo=test&bar=test'}                   | ${{ foo: 'test', bar: 'test' }} | ${'multiple same values'}
    ${'foo='}                                | ${{ foo: '' }}                  | ${'no value'}
    ${'foo=&'}                               | ${{ foo: '' }}                  | ${'no value with &'}
    ${'foo= &'}                              | ${{ foo: ' ' }}                 | ${'whitespace with &'}
    ${' foo =  test   '}                     | ${{ ' foo ': '  test' }}        | ${'whitespace'}
    ${'Σ=😋'}                                | ${{ Σ: '😋' }}                  | ${'unicode'}
    ${`test=${encodeURIComponent('?=/&:')}`} | ${{ test: '?=/&:' }}            | ${'encoded'}
    ${`test=f?oo`}                           | ${{ test: 'f?oo' }}             | ${'no encoding'}
  `('should return $expected when $param is passed', ({ param, expected }) => {
    const url = `https://foo.com/?${param}`;

    const result = parseQueryParameters(url);
    expect(result).toEqual(expected);
  });
});
