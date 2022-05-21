import lowerCaseKeys from '../lowerCaseKeys.js'

describe('lowerCaseKeys', () => {
  test(`should handle empty object`, () => {
    const result = lowerCaseKeys({})
    expect(result).toEqual({})
  })

  test(`should handle object with one key`, () => {
    const result = lowerCaseKeys({ 'Some-Key': 'value' })
    expect(result).toEqual({ 'some-key': 'value' })
  })

  test(`should handle object with multiple keys`, () => {
    const result = lowerCaseKeys({
      'Some-Key': 'value',
      'Another-Key': 'anotherValue',
      'lOts-OF-CAPitaLs': 'ButThisIsNotTouched',
      'already-lowercase': 'cool',
    })
    expect(result).toEqual({
      'some-key': 'value',
      'another-key': 'anotherValue',
      'lots-of-capitals': 'ButThisIsNotTouched',
      'already-lowercase': 'cool',
    })
  })
})
