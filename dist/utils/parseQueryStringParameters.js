import { BASE_URL_PLACEHOLDER } from '../config/index.js'
const { fromEntries } = Object
export default function parseQueryStringParameters(url) {
  const { searchParams } = new URL(url, BASE_URL_PLACEHOLDER)
  if (Array.from(searchParams).length === 0) {
    return null
  }
  return fromEntries(searchParams)
}
