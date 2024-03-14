import unflatten from './unflatten.js'
const { fromEntries } = Object
export default function parseHeaders(rawHeaders) {
  if (rawHeaders.length === 0) {
    return null
  }
  const unflattened = unflatten(rawHeaders, 2)
  return fromEntries(unflattened)
}
