'use strict';

const satisfiesVersionRange = require('../satisfiesVersionRange.js');

describe('satisfiesVersionRange', () => {
  describe('valid parameters', () => {
    test.each`
      range       | version      | expected | description
      ${'>=1.38'} | ${'1.38.0'}  | ${true}  | ${'same as minimum'}
      ${'>=1.38'} | ${'1.40.0'}  | ${true}  | ${'greather than minimum'}
      ${'>=1.38'} | ${'1.37.11'} | ${false} | ${'less than minimum'}
    `(
      'should return $expected when $description is passed',
      ({ expected, range, version }) => {
        const result = satisfiesVersionRange(range, version);
        expect(result).toEqual(expected);
      },
    );
  });

  describe('should throw when invalid parameters are passed', () => {
    test.each`
      range       | version     | description
      ${'>=1.40'} | ${'a.b.c'}  | ${'invalid version'}
      ${'a.b.c'}  | ${'1.40.0'} | ${'invalid range'}
    `(
      'should throw error when $description is passed',
      ({ range, version }) => {
        expect(() =>
          satisfiesVersionRange(range, version),
        ).toThrowErrorMatchingSnapshot();
      },
    );
  });
});
