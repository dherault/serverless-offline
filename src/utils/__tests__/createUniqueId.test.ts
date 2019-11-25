import createUniqueId from '../createUniqueId'

describe('createUniqueId', () => {
  test('should be unique', () => {
    const items = 100000
    const set = new Set(Array.from(Array(items)).map(createUniqueId))

    expect(set.size).toEqual(items)
  })

  test('should be a 25 character string', () => {
    const id = createUniqueId()

    expect(typeof id).toEqual('string')
    expect(id.length).toEqual(25)
  })
})
