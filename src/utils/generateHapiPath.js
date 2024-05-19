export default function generateHapiPath(path, options, serverless) {
  let hapiPath = path.startsWith("/") ? path : `/${path}`

  if (!options.noPrependStageInUrl) {
    const stage = options.stage || serverless.service.provider.stage
    // prepend the stage to path
    hapiPath = `/${stage}${hapiPath}`
  }

  if (options.prefix) {
    hapiPath = `/${options.prefix}${hapiPath}`
  }

  if (hapiPath !== "/" && hapiPath.endsWith("/")) {
    hapiPath = hapiPath.slice(0, -1)
  }

  hapiPath = hapiPath.replaceAll("+}", "*}")

  return hapiPath
}

export function generateAlbHapiPath(path, options, serverless) {
  // path must start with '/'
  let hapiPath = path.startsWith("/") ? path : `/${path}`

  if (!options.noPrependStageInUrl) {
    const stage = options.stage || serverless.service.provider.stage
    // prepend the stage to path
    hapiPath = `/${stage}${hapiPath}`
  }

  if (options.prefix) {
    hapiPath = `/${options.prefix}${hapiPath}`
  }

  if (
    hapiPath !== "/" &&
    hapiPath.endsWith("/") &&
    !options.noStripTrailingSlashInUrl
  ) {
    hapiPath = hapiPath.slice(0, -1)
  }

  for (let i = 0; hapiPath.includes("*"); i += 1) {
    hapiPath = hapiPath.replace("*", `{${i}}`)
  }

  return hapiPath
}
