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
  if (policyResource === resource) {
    return true
  }
  if (policyResource === '*') {
    return true
  }
  if (policyResource === 'arn:aws:execute-api:**') {
    return true
  }
  if (policyResource === 'arn:aws:execute-api:*:*:*') {
    return true
  }
  if (policyResource.includes('*') || policyResource.includes('?')) {
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
    const regExp = new RegExp(
      parsedPolicyResource.path.replace(/\*/g, '.*').replace(/\?/g, '.'),
    )
    return regExp.test(parsedResource.path)
  }
  return false
}
