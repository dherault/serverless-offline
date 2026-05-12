function calculateTtl(attributes) {
  // Try max-age first (in seconds, convert to milliseconds)
  const maxAgeSeconds = Number(attributes["max-age"])
  if (Number.isFinite(maxAgeSeconds)) {
    return maxAgeSeconds * 1000
  }

  // Fall back to expires (absolute date)
  if (attributes.expires) {
    const expiresDate = new Date(attributes.expires)
    const now = new Date()
    const expiresMs = expiresDate.getTime() - now.getTime()
    return Number.isFinite(expiresMs) ? expiresMs : undefined
  }

  return undefined
}

export default function generateHapiCookie(cookieString) {
  const equalsIndex = cookieString.indexOf("=")
  if (equalsIndex === -1) {
    return {
      name: cookieString,
      options: {
        domain: undefined,
        encoding: "none",
        isHttpOnly: false,
        isSameSite: false,
        isSecure: false,
        path: undefined,
        strictHeader: false,
        ttl: undefined,
      },
      value: "",
    }
  }
  const semicolonIndex = cookieString.indexOf(";")
  const valueEndIndex =
    semicolonIndex === -1 ? cookieString.length : semicolonIndex
  const name = cookieString.slice(0, equalsIndex)
  const value = cookieString.slice(equalsIndex + 1, valueEndIndex)

  // Parse attributes into a map
  const attributes = cookieString
    .split(";")
    .slice(1) // skip the name=value part
    .reduce((acc, part) => {
      const [key, val] = part.trim().split("=")
      acc[key.trim().toLowerCase()] = val ? val.trim() : true
      return acc
    }, {})

  // Calculate TTL from max-age or expires attribute
  const ttl = calculateTtl(attributes)

  return {
    name,
    options: {
      domain: attributes.domain,
      encoding: "none",
      isHttpOnly: attributes.httponly === true ? true : undefined,
      isSameSite: attributes.samesite || false,
      isSecure: attributes.secure === true ? true : undefined,
      path: attributes.path,
      strictHeader: false,
      ttl,
    },
    value,
  }
}
