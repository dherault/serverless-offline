import {
  detectEncoding,
  nullIfEmpty,
  toPlainOrEmptyObject,
} from '../../src/utils/index'

describe('utils', () => {
  describe('#toPlainOrEmptyObject', () => {
    describe('with a plain object', () => {
      test('should return the plain object', () => {
        const plainObject = { name: 'Leonardo' }
        expect(toPlainOrEmptyObject(plainObject)).toEqual(plainObject)
      })
    })

    describe('with a non plain object', () => {
      test('should return an empty object', () => {
        const nonPlainObject = []
        expect(toPlainOrEmptyObject(nonPlainObject)).toEqual({})
      })
    })
  })

  describe('#nullIfEmpty', () => {
    describe('with a non empty object', () => {
      test('should return the non empty object', () => {
        const nonEmptyObject = { name: 'Leonardo' }
        expect(nullIfEmpty(nonEmptyObject)).toEqual(nonEmptyObject)
      })
    })

    describe('with an empty object', () => {
      test('should return null', () => {
        expect(nullIfEmpty({})).toEqual(null)
      })
    })
  })

  describe('#detectEncoding', () => {
    describe('with application/json content-type', () => {
      test('should return utf8', () => {
        const request = {
          headers: {
            'content-type': 'application/json',
          },
        }
        expect(detectEncoding(request)).toEqual('utf8')
      })
    })

    describe('with multipart/form-data content-type', () => {
      test('should return binary', () => {
        const request = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
        expect(detectEncoding(request)).toEqual('binary')
      })
    })
  })
})
