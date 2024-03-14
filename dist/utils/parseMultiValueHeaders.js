import unflatten from './unflatten.js'
const { fromEntries } = Object
export default function parseMultiValueHeaders(rawHeaders) {
  if (rawHeaders.length === 0) {
    return null
  }
  const map = new Map()
  const unflattened = unflatten(rawHeaders, 2)
  for (const [key, value] of unflattened) {
    const item = map.get(key)
    if (item) {
      item.push(value)
    } else {
      map.set(key, [value])
    }
  }
  return fromEntries(map)
}
