import assert from 'node:assert'
import createUniqueId from '../createUniqueId.js'

describe('createUniqueId', () => {
  it('should be unique', () => {
    const items = 100000
    const set = new Set(Array.from(Array(items)).map(createUniqueId))

    assert.equal(set.size, items)
  })

  it('should be a 36 character string', () => {
    const id = createUniqueId()

    assert.equal(typeof id, 'string')
    assert.equal(id.length, 36)
  })
})
