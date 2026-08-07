const { isArray } = Array
const { entries } = Object

// ALB comparison strings support two wildcard characters:
// '*' matches 0 or more characters and '?' matches exactly 1 character.
// Comparisons are case insensitive.
// https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_RuleCondition.html
function patternToRegExp(pattern) {
  const source = String(pattern)
    .replaceAll(/[$()+.?[\\\]^{|}]/g, String.raw`\$&`)
    .replaceAll("*", ".*")
    .replaceAll(String.raw`\?`, ".")

  return new RegExp(`^${source}$`, "i")
}

function matchesAnyPattern(value, patterns) {
  return patterns.some((pattern) => patternToRegExp(pattern).test(value))
}

function toArray(value) {
  if (value == null) {
    return []
  }

  return isArray(value) ? value : [value]
}

function matchesHost(hosts, headers) {
  // the host condition is matched against the host name only, the port is ignored
  const host = (headers.host ?? "").split(":")[0]

  return matchesAnyPattern(host, hosts)
}

function matchesHeader({ name, values }, headers) {
  // header names are case insensitive, hapi lower cases them
  const headerValue = headers[String(name).toLowerCase()]

  if (headerValue === undefined) {
    return false
  }

  // hapi joins repeated headers with ', ', AWS searches them in order until a
  // match is found. the joined value is tested first, so that values which
  // legitimately contain a comma still match.
  const headerValues = isArray(headerValue) ? headerValue : [headerValue]
  const candidates = headerValues.flatMap((value) => [
    value,
    ...String(value)
      .split(",")
      .map((part) => part.trim()),
  ])

  return candidates.some((candidate) =>
    matchesAnyPattern(candidate, toArray(values)),
  )
}

function matchesQuery(query, requestQuery) {
  // the condition is satisfied if one of the key/value pairs is found
  return entries(query).some(([key, value]) => {
    const requestValues = toArray(requestQuery[key])

    return requestValues.some((requestValue) =>
      matchesAnyPattern(requestValue, [value]),
    )
  })
}

// Emulates the way an ALB listener rule matches a request.
// 'path' and 'method' are not evaluated here, they are handled by the hapi
// router. 'ip' is not evaluated, every offline request originates from the
// local machine.
export default function matchAlbConditions(conditions, { headers, query }) {
  const { header, host, query: queryConditions } = conditions ?? {}

  if (host != null && !matchesHost(toArray(host), headers)) {
    return false
  }

  // every header condition has to match, values within a condition are OR'ed
  if (
    header != null &&
    !toArray(header).every((headerCondition) =>
      matchesHeader(headerCondition, headers),
    )
  ) {
    return false
  }

  if (queryConditions != null && !matchesQuery(queryConditions, query ?? {})) {
    return false
  }

  return true
}
