import parseQueryStringParameters from './parseQueryStringParameters.js'

export default function getRawQueryParams(url) {
  const queryParams = parseQueryStringParameters(url) || {}
  return Object.keys(queryParams)
    .reduce(function reducer(accumulator, currentKey) {
      accumulator.push(`${currentKey}=${queryParams[currentKey]}`)
      return accumulator
    }, [])
    .join('&')
}
