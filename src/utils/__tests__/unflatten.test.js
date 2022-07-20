import assert from 'node:assert'
import unflatten from '../unflatten.js'

describe('unflatten', () => {
  it('should work with empty array parameter', () => {
    const value = []
    const out = unflatten(value, 2)
    const expected = []

    assert.deepEqual(out, expected)
  })

  it('should work with single pair parameter', () => {
    const value = ['a', 1]
    const out = unflatten(value, 2)
    const expected = [['a', 1]]

    assert.deepEqual(out, expected)
  })

  it('should work with multiple pair parameters', () => {
    const value = ['a', 1, 'b', 2, 'c', 3]
    const out = unflatten(value, 2)
    const expected = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]

    assert.deepEqual(out, expected)
  })
})
