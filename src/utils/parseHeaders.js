import unflat from 'array-unflat-js'

const { fromEntries } = Object

// (rawHeaders: Array<string>): { [string]: string }
export default function parseHeaders(rawHeaders) {
  if (rawHeaders.length === 0) {
    return null
  }

  const unflattened = unflat(rawHeaders)

  return fromEntries(unflattened)
}
