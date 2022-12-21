const { entries, fromEntries } = Object

// (obj: { [string]: string }): { [Lowercase<string>]: string }
export default function parseHeaders(obj) {
  return fromEntries(entries(obj).map(([k, v]) => [k.toLowerCase(), v]))
}
