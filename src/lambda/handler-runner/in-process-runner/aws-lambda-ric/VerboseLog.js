/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/**
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 */

"use strict"

const process = require("node:process")

const EnvVarName = "AWS_LAMBDA_RUNTIME_VERBOSE"
const Tag = "RUNTIME"
const Verbosity = (() => {
  if (!process.env[EnvVarName]) {
    return 0
  }

  try {
    const verbosity = Number.parseInt(process.env[EnvVarName], 10)
    // eslint-disable-next-line unicorn/no-nested-ternary
    return verbosity < 0 ? 0 : verbosity > 3 ? 3 : verbosity
  } catch {
    return 0
  }
})()

exports.logger = function (category) {
  return {
    verbose() {
      if (Verbosity >= 1) {
        const args = [...arguments].map((arg) =>
          typeof arg === "function" ? arg() : arg,
        )
        // eslint-disable-next-line no-console
        Reflect.apply(console.log, null, [Tag, category, ...args])
      }
    },
    vverbose() {
      if (Verbosity >= 2) {
        const args = [...arguments].map((arg) =>
          typeof arg === "function" ? arg() : arg,
        )
        // eslint-disable-next-line no-console
        Reflect.apply(console.log, null, [Tag, category, ...args])
      }
    },
    vvverbose() {
      if (Verbosity >= 3) {
        const args = [...arguments].map((arg) =>
          typeof arg === "function" ? arg() : arg,
        )
        // eslint-disable-next-line no-console
        Reflect.apply(console.log, null, [Tag, category, ...args])
      }
    },
  }
}
