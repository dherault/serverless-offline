import unflat from "array-unflat-js"

const { fromEntries } = Object

// https://aws.amazon.com/blogs/compute/support-for-multi-value-parameters-in-amazon-api-gateway/
// (rawHeaders: Array<string>): { [string]: Array<string> }
export default function parseMultiValueHeaders(rawHeaders) {
  if (rawHeaders.length === 0) {
    return null
  }

  const map = new Map()
  const unflattened = unflat(rawHeaders)

  // eslint-disable-next-line no-restricted-syntax
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
