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
      'already-lowercase': 'cool',
      'Another-Key': 'anotherValue',
      'lOts-OF-CAPitaLs': 'ButThisIsNotTouched',
      'Some-Key': 'value',
    })
    expect(result).toEqual({
      'already-lowercase': 'cool',
      'another-key': 'anotherValue',
      'lots-of-capitals': 'ButThisIsNotTouched',
      'some-key': 'value',
    })
  })
})
