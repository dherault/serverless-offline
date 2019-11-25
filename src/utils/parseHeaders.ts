import unflatten from './unflatten'

const { fromEntries } = Object

// (rawHeaders: Array<string>): { [string]: string }
export default function parseHeaders(rawHeaders: string[]) {
  if (rawHeaders.length === 0) {
    return null
  }

  const unflattened = unflatten(rawHeaders, 2)

  return fromEntries(unflattened)
}
