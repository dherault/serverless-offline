function parseResource(resource) {
  const [, region, accountId, restApiId, path] = resource.match(
    /arn:aws:execute-api:(.*?):(.*?):(.*?)\/(.*)/,
  )

  return {
    accountId,
    path,
    region,
    restApiId,
  }
}

export default function authMatchPolicyResource(policyResource, resource) {
  // resource and policyResource are ARNs
  if (policyResource === resource) {
    return true
  }

  if (policyResource === '*') {
    return true
  }

  if (policyResource === 'arn:aws:execute-api:**') {
    // better fix for #523
    return true
  }

  if (policyResource === 'arn:aws:execute-api:*:*:*') {
    return true
  }

  if (policyResource.includes('*') || policyResource.includes('?')) {
    // Policy contains a wildcard resource

    const parsedPolicyResource = parseResource(policyResource)
    const parsedResource = parseResource(resource)

    if (
      parsedPolicyResource.region !== '*' &&
      parsedPolicyResource.region !== parsedResource.region
    ) {
      return false
    }

    if (
      parsedPolicyResource.accountId !== '*' &&
      parsedPolicyResource.accountId !== parsedResource.accountId
    ) {
      return false
    }

    if (
      parsedPolicyResource.restApiId !== '*' &&
      parsedPolicyResource.restApiId !== parsedResource.restApiId
    ) {
      return false
    }

    // The path contains stage, method and the path
    // for the requested resource and the resource defined in the policy
    // Need to create a regex replacing ? with one character and * with any number of characters
    const regExp = new RegExp(
      parsedPolicyResource.path.replace(/\*/g, '.*').replace(/\?/g, '.'),
    )

    return regExp.test(parsedResource.path)
  }

  return false
}
