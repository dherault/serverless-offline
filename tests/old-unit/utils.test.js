import assert from "node:assert"
import {
  detectEncoding,
  nullIfEmpty,
  toPlainOrEmptyObject,
} from "../../src/utils/index.js"

describe("utils", () => {
  describe("#toPlainOrEmptyObject", () => {
    describe("with a plain object", () => {
      it("should return the plain object", () => {
        const plainObject = { name: "Leonardo" }
        assert.deepStrictEqual(toPlainOrEmptyObject(plainObject), plainObject)
      })
    })

    describe("with a non plain object", () => {
      it("should return an empty object", () => {
        const nonPlainObject = []
        assert.deepStrictEqual(toPlainOrEmptyObject(nonPlainObject), {})
      })
    })
  })

  describe("#nullIfEmpty", () => {
    describe("with a non empty object", () => {
      it("should return the non empty object", () => {
        const nonEmptyObject = { name: "Leonardo" }
        assert.deepStrictEqual(nullIfEmpty(nonEmptyObject), nonEmptyObject)
      })
    })

    describe("with an empty object", () => {
      it("should return null", () => {
        assert.strictEqual(nullIfEmpty({}), null)
      })
    })
  })

  describe("#detectEncoding", () => {
    describe("with application/json content-type", () => {
      it("should return utf8", () => {
        const request = {
          headers: {
            "content-type": "application/json",
          },
        }
        assert.strictEqual(detectEncoding(request), "utf8")
      })
    })

    describe('with application/octet-stream content-type', () => {
      it('should return binary', () => {
        const request = {
          headers: {
            'content-type': 'application/octet-stream',
          },
        }
        assert.strictEqual(detectEncoding(request), 'binary')
      })
    })

    describe('with multipart/form-data content-type', () => {
      it('should return binary', () => {
        const request = {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
        assert.strictEqual(detectEncoding(request), "binary")
      })
    })
  })
})
