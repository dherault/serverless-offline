/* eslint-disable no-bitwise */
import { basename } from "node:path"

const { parseInt } = Number

const DEFAULT_FILE_MODE = 0o644

// A zip archive does not necessarily carry unix permissions, in which case the
// extracted files would not be executable. The bootstrap of a custom runtime
// has to be.
// https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html#runtimes-custom-build
export default function layerFileMode(filename, unixPermissions) {
  let mode = DEFAULT_FILE_MODE

  if (typeof unixPermissions === "number" && (unixPermissions & 0o777) > 0) {
    mode = unixPermissions & 0o7777
  } else if (typeof unixPermissions === "string" && unixPermissions !== "") {
    mode = parseInt(unixPermissions, 8)
  }

  return basename(filename) === "bootstrap" ? mode | 0o111 : mode
}
