export default function getApiKeysValues(apiKeys) {
  return new Set(
    apiKeys.filter(({ value }) => value != null).map(({ value }) => value),
  )
}
