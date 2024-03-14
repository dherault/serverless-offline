const { entries, fromEntries } = Object
export default function parseHeaders(obj) {
  return fromEntries(entries(obj).map(([k, v]) => [k.toLowerCase(), v]))
}
