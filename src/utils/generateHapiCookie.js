export default function generateHapiCookie(cookieString) {
  const equalsIndex = cookieString.indexOf("=")
  if (equalsIndex === -1) {
    return {
      name: cookieString,
      value: "",
      options: {
        ttl: undefined,
        isSecure: false,
        isHttpOnly: false,
        path: undefined,
        domain: undefined,
        isSameSite: false,
        encoding: "none",
        strictHeader: false,
      },
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

  const maxAgeSeconds = Number(attributes["max-age"])
  const ttl = Number.isFinite(maxAgeSeconds) ? maxAgeSeconds * 1000 : undefined

  return {
    name,
    value,
    options: {
      ttl,
      isSecure: attributes.secure === true ? true : undefined,
      isHttpOnly: attributes.httponly === true ? true : undefined,
      path: attributes.path,
      domain: attributes.domain,
      isSameSite: attributes.samesite || false,
      encoding: "none",
      strictHeader: false,
    },
  }
}
