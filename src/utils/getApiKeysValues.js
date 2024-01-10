export default function getApiKeysValues(apiKeys) {
  return new Set(
    apiKeys
      .map((apiKey) => {
        if (typeof apiKey === "object" && apiKey.value != null) {
          return apiKey.value
        }
        if (typeof apiKey === "string") {
          return apiKey
        }
        return undefined
      })
      .filter((apiKey) => !!apiKey),
  )
}
