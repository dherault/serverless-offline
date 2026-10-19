"use strict"

try {
  // eslint-disable-next-line global-require
  module.exports = require("./index.js").default
} catch (error) {
  if (error.code !== "ERR_REQUIRE_ESM") {
    throw error
  }

  // node.js versions without require(esm) support (< v20.19.0, < v22.12.0)
  // export a promise instead, which serverless v3 awaits when loading plugins
  module.exports = import("./index.js").then(
    ({ default: ServerlessOffline }) => ServerlessOffline,
  )
}
