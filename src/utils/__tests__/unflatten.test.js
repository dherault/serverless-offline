import unflatten from '../unflatten.js'

describe('unflatten', () => {
  test('should work with empty array parameter', () => {
    const value = []
    const out = unflatten(value, 2)
    const expected = []

    expect(out).toEqual(expected)
  })

  test('should work with single pair parameter', () => {
    const value = ['a', 1]
    const out = unflatten(value, 2)
    const expected = [['a', 1]]

    expect(out).toEqual(expected)
  })

  test('should work with multiple pair parameters', () => {
    const value = ['a', 1, 'b', 2, 'c', 3]
    const out = unflatten(value, 2)
    const expected = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]

    expect(out).toEqual(expected)
  })

  test('should throw with uneven length I.', () => {
    const value = ['a']

    expect(() => unflatten(value, 2)).toThrowErrorMatchingSnapshot()
  })

  test('should throw with uneven length II.', () => {
    const value = ['a', 'b', 'c']

    expect(() => unflatten(value, 2)).toThrowErrorMatchingSnapshot()
  })
})
