import toLowerCase from '../toLowercase.js'

describe('test lowercase function', () => {
  test('it return itself when non-string is input', () => {
    const value = toLowerCase(undefined)
    const objectValue = toLowerCase({})
    const numberValue = toLowerCase(100)
    const nullValue = toLowerCase(null)

    expect(value).toEqual(undefined)
    expect(objectValue).toEqual({})
    expect(numberValue).toEqual(100)
    expect(nullValue).toEqual(null)
  })

  test('it lowercase string value', () => {
    const value = toLowerCase('STRING')
    const secondValue = toLowerCase('REQUEST')

    expect(value).toBe('string')
    expect(secondValue).toBe('request')
  })
})
