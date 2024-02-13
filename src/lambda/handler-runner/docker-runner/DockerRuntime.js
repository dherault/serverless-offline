import { supportedRuntimesArchitecture } from "../../../config/supportedRuntimes.js"

export default class Runtime {
  getImageNameTag(runtime, architecture) {
    let runtimeImageTag = ""

    if (runtime === this.provided) {
      runtimeImageTag = "provided:alami"
    } else if (runtime.startsWith("provided")) {
      runtimeImageTag = runtime.replace(".", ":")
    } else if (runtime.startsWith("dotnet")) {
      runtimeImageTag = runtime.replace("dotnet", "dotnet:")
    } else {
      const match = /^([a-z]+)(\d[\d.a-z]*)$/.exec(runtime)
      runtimeImageTag = match ? `${match[1]}:${match[2]}` : runtime
      runtimeImageTag = runtimeImageTag.replace(".x", "")
    }

    if (this.hasRuntimeMultiArchImage(runtime)) {
      runtimeImageTag = `${runtimeImageTag}-${architecture}`
    }

    return runtimeImageTag
  }

  hasRuntimeMultiArchImage(runtime) {
    return (
      (supportedRuntimesArchitecture[runtime] &&
        supportedRuntimesArchitecture[runtime].length > 1) ||
      false
    )
  }
}
