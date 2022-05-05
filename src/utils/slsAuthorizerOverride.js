export default function parseSLSOfflineAuthorizerOverride(headers) {
  try {
    return JSON.parse(headers['sls-offline-authorizer-override'])
  } catch (error) {
    if (this.log) {
      this.log.error(
        'Could not parse header sls-offline-authorizer-override, make sure it is correct JSON',
      )
    } else {
      console.error(
        'Serverless-offline: Could not parse header sls-offline-authorizer-override make sure it is correct JSON.',
      )
    }
  }

  return undefined
}
