// The Lambda API takes the name of a layer, or its ARN without the version,
// and the version number separately.
// https://docs.aws.amazon.com/lambda/latest/api/API_GetLayerVersion.html
export default function parseLayerArn(layerArn) {
  if (typeof layerArn !== "string") {
    return null
  }

  const [, layerName] = layerArn.split(":layer:")

  if (!layerName) {
    return null
  }

  const [name, version] = layerName.split(":")

  if (!/^\d+$/.test(version ?? "")) {
    return null
  }

  return {
    name,
    unversionedArn: layerArn.slice(0, layerArn.lastIndexOf(":")),
    version: Number(version),
  }
}
