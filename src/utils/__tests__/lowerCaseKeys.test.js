import assert from 'node:assert'
import lowerCaseKeys from '../lowerCaseKeys.js'

describe('lowerCaseKeys', () => {
  it('should handle empty object', () => {
    const result = lowerCaseKeys({})
    assert.deepEqual(result, {})
  })

  it('should handle object with one key', () => {
    const result = lowerCaseKeys({ 'Some-Key': 'value' })
    assert.deepEqual(result, { 'some-key': 'value' })
  })

  it('should handle object with multiple keys', () => {
    const result = lowerCaseKeys({
      'already-lowercase': 'cool',
      'Another-Key': 'anotherValue',
      'lOts-OF-CAPitaLs': 'ButThisIsNotTouched',
      'Some-Key': 'value',
    })

    assert.deepEqual(result, {
      'already-lowercase': 'cool',
      'another-key': 'anotherValue',
      'lots-of-capitals': 'ButThisIsNotTouched',
      'some-key': 'value',
    })
  })
})
