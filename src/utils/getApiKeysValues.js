export default function getApiKeysValues(apiKeys) {
  return new Set(
    apiKeys
      .filter((apiKey) => typeof apiKey === 'object' && apiKey.value != null)
      .map(({ value }) => value),
  )
}
