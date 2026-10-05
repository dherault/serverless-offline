const { toString } = Object.prototype

// String(value) throws for some values, e.g. Object.create(null) or an object
// whose Symbol.toPrimitive throws. Used for values a handler rejected with,
// which can be anything.
export default function toSafeString(value) {
  try {
    return String(value)
  } catch {
    try {
      return toString.call(value)
    } catch {
      return "[value which can't be converted to a string]"
    }
  }
}
