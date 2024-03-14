import { BASE_URL_PLACEHOLDER } from '../config/index.js'
const { fromEntries } = Object
export default function parseMultiValueQueryStringParameters(url) {
  const { searchParams } = new URL(url, BASE_URL_PLACEHOLDER)
  if (Array.from(searchParams).length === 0) {
    return null
  }
  const map = new Map()
  for (const [key, value] of searchParams) {
    const item = map.get(key)
    if (item) {
      item.push(value)
    } else {
      map.set(key, [value])
    }
  }
  return fromEntries(map)
}
