/**
 *
 * @description Instead of using `multiValueQueryStringParameters` API Gateway HTTP API combines
 * duplicate query string keys with commas in the `queryStringParameters` field.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 *
 * @param { URLSearchParams } searchParams
 */
export default function parseQueryStringParametersForPayloadV2(searchParams) {
  const keyValuePairs = Array.from(searchParams)

  if (keyValuePairs.length === 0) {
    return null
  }

  return keyValuePairs.reduce((previousValue, [key, value]) => {
    if (!previousValue[key]) {
      return { ...previousValue, [key]: value }
    }
    return { ...previousValue, [key]: [previousValue[key], value].join(',') }
  }, {})
}
