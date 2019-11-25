import satisfiesVersionRange from '../satisfiesVersionRange'

describe('satisfiesVersionRange', () => {
  describe('valid parameters', () => {
    test.each`
      version      | range       | expected | description
      ${'1.38.0'}  | ${'>=1.38'} | ${true}  | ${'same as minimum'}
      ${'1.40.0'}  | ${'>=1.38'} | ${true}  | ${'greather than minimum'}
      ${'1.37.11'} | ${'>=1.38'} | ${false} | ${'less than minimum'}
    `(
      'should return $expected when $description is passed',
      ({ expected, range, version }) => {
        const result = satisfiesVersionRange(version, range)
        expect(result).toEqual(expected)
      },
    )
  })

  describe('should throw when invalid parameters are passed', () => {
    test.each`
      version     | range       | description
      ${'a.b.c'}  | ${'>=1.40'} | ${'invalid version'}
      ${'1.40.0'} | ${'a.b.c'}  | ${'invalid range'}
    `(
      'should throw error when $description is passed',
      ({ range, version }) => {
        expect(() =>
          satisfiesVersionRange(version, range),
        ).toThrowErrorMatchingSnapshot()
      },
    )
  })
})
