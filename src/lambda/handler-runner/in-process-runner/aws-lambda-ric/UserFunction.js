/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/**
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This code was copied from:
 * https://github.com/aws/aws-lambda-nodejs-runtime-interface-client/blob/main/src/UserFunction.js
 *
 * This module defines the functions for loading the user's code as specified
 * in a handler string.
 */

"use strict"

const path = require("node:path")
const { pathToFileURL } = require("node:url")
const fs = require("node:fs")
const process = require("node:process")

const { require: tsxRequire } = require(`tsx/cjs/api`)
const {
  HandlerNotFound,
  MalformedHandlerName,
  ImportModuleError,
  UserCodeSyntaxError,
  MalformedStreamingHandler,
} = require("./Errors.js")
const { verbose } = require("./VerboseLog.js").logger("LOADER")
const { HttpResponseStream } = require("./HttpResponseStream.js")

const FUNCTION_EXPR = /^([^.]*)\.(.*)$/
const RELATIVE_PATH_SUBSTRING = ".."
const HANDLER_STREAMING = Symbol.for("aws.lambda.runtime.handler.streaming")
const HANDLER_HIGHWATERMARK = Symbol.for(
  "aws.lambda.runtime.handler.streaming.highWaterMark",
)
const STREAM_RESPONSE = "response"

// `awslambda.streamifyResponse` function is provided by default.
const NoGlobalAwsLambda =
  process.env.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA === "1" ||
  process.env.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA === "true"

/**
 * Break the full handler string into two pieces, the module root and the actual
 * handler string.
 * Given './somepath/something/module.nestedobj.handler' this returns
 * ['./somepath/something', 'module.nestedobj.handler']
 */
function _moduleRootAndHandler(fullHandlerString) {
  const handlerString = path.basename(fullHandlerString)
  const moduleRoot = fullHandlerString.substring(
    0,
    fullHandlerString.indexOf(handlerString),
  )
  return [moduleRoot, handlerString]
}

/**
 * Split the handler string into two pieces: the module name and the path to
 * the handler function.
 */
function _splitHandlerString(handler) {
  const match = handler.match(FUNCTION_EXPR)
  if (!match || match.length !== 3) {
    throw new MalformedHandlerName("Bad handler")
  }
  return [match[1], match[2]] // [module, function-path]
}

/**
 * Resolve the user's handler function from the module.
 */
function _resolveHandler(object, nestedProperty) {
  return nestedProperty.split(".").reduce((nested, key) => {
    return nested && nested[key]
  }, object)
}

function _tryRequireFile(file, extension) {
  const pathRequireFile = file + (extension || "")
  verbose("Try loading as commonjs:", pathRequireFile)
  return fs.existsSync(pathRequireFile) ? require(pathRequireFile) : undefined
}

async function _tryAwaitImport(file, extension) {
  const pathAwaitImport = file + (extension || "")
  verbose("Try loading as esmodule:", pathAwaitImport)

  if (fs.existsSync(pathAwaitImport)) {
    // eslint-disable-next-line no-return-await
    return await import(pathToFileURL(pathAwaitImport).href)
  }

  return undefined
}

function _hasFolderPackageJsonTypeModule(folder) {
  // Check if package.json exists, return true if type === "module" in package json.
  // If there is no package.json, and there is a node_modules, return false.
  // Check parent folder otherwise, if there is one.
  if (folder.endsWith("/node_modules")) {
    return false
  }

  const pj = path.join(folder, "/package.json")
  if (fs.existsSync(pj)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pj))
      if (pkg) {
        if (pkg.type === "module") {
          verbose("type: module detected in", pj)
          return true
        }
        verbose("type: module not detected in", pj)
        return false
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        `${pj} cannot be read, it will be ignored for ES module detection purposes.`,
        e,
      )
      return false
    }
  }

  if (folder === "/") {
    // We have reached root without finding either a package.json or a node_modules.
    return false
  }

  return _hasFolderPackageJsonTypeModule(path.resolve(folder, ".."))
}

function _hasPackageJsonTypeModule(file) {
  // File must have a .js extension
  const jsPath = `${file}.js`
  return fs.existsSync(jsPath)
    ? _hasFolderPackageJsonTypeModule(path.resolve(path.dirname(jsPath)))
    : false
}

/**
 * Attempt to load the user's module.
 * Attempts to directly resolve the module relative to the application root,
 * then falls back to the more general require().
 */
async function _tryRequire(appRoot, moduleRoot, module) {
  verbose(
    "Try loading as commonjs: ",
    module,
    " with paths: ,",
    appRoot,
    moduleRoot,
  )

  const lambdaStylePath = path.resolve(appRoot, moduleRoot, module)

  // Extensionless files are loaded via require.
  const extensionless = _tryRequireFile(lambdaStylePath)
  if (extensionless) {
    return extensionless
  }

  // If package.json type != module, .js files are loaded via require.
  const pjHasModule = _hasPackageJsonTypeModule(lambdaStylePath)
  if (!pjHasModule) {
    const loaded = _tryRequireFile(lambdaStylePath, ".js")
    if (loaded) {
      return loaded
    }
  }

  // If still not loaded, try .js, .mjs, .cjs and .ts in that order.
  // Files ending with .js are loaded as ES modules when the nearest parent package.json
  // file contains a top-level field "type" with a value of "module".
  // https://nodejs.org/api/packages.html#packages_type
  const loaded =
    (pjHasModule && (await _tryAwaitImport(lambdaStylePath, ".js"))) ||
    (await _tryAwaitImport(lambdaStylePath, ".mjs")) ||
    _tryRequireFile(lambdaStylePath, ".cjs") ||
    tsxRequire(`${lambdaStylePath}.ts`, `${lambdaStylePath}.ts`)
  if (loaded) {
    return loaded
  }

  verbose(
    "Try loading as commonjs: ",
    module,
    " with path(s): ",
    appRoot,
    moduleRoot,
  )

  // Why not just require(module)?
  // Because require() is relative to __dirname, not process.cwd(). And the
  // runtime implementation is not located in /var/task
  // This won't work (yet) for esModules as import.meta.resolve is still experimental
  // See: https://nodejs.org/api/esm.html#esm_import_meta_resolve_specifier_parent
  const nodeStylePath = require.resolve(module, {
    paths: [appRoot, moduleRoot],
  })

  return require(nodeStylePath)
}

/**
 * Load the user's application or throw a descriptive error.
 * @throws Runtime errors in two cases
 *   1 - UserCodeSyntaxError if there's a syntax error while loading the module
 *   2 - ImportModuleError if the module cannot be found
 */
async function _loadUserApp(appRoot, moduleRoot, module) {
  if (!NoGlobalAwsLambda) {
    globalThis.awslambda = {
      HttpResponseStream,
      streamifyResponse: (handler, options) => {
        // eslint-disable-next-line no-param-reassign
        handler[HANDLER_STREAMING] = STREAM_RESPONSE
        if (typeof options?.highWaterMark === "number") {
          // eslint-disable-next-line no-param-reassign
          handler[HANDLER_HIGHWATERMARK] = Number.parseInt(
            options.highWaterMark,
            10,
          )
        }
        return handler
      },
    }
  }

  try {
    return await _tryRequire(appRoot, moduleRoot, module)
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new UserCodeSyntaxError(e)
    } else if (e.code !== undefined && e.code === "MODULE_NOT_FOUND") {
      verbose("globalPaths", JSON.stringify(require("node:module").globalPaths))
      throw new ImportModuleError(e)
    } else {
      throw e
    }
  }
}

function _throwIfInvalidHandler(fullHandlerString) {
  if (fullHandlerString.includes(RELATIVE_PATH_SUBSTRING)) {
    throw new MalformedHandlerName(
      `'${fullHandlerString}' is not a valid handler name. Use absolute paths when specifying root directories in handler names.`,
    )
  }
}

function _isHandlerStreaming(handler) {
  if (
    handler[HANDLER_STREAMING] === undefined ||
    handler[HANDLER_STREAMING] === null ||
    handler[HANDLER_STREAMING] === false
  ) {
    return false
  }

  if (handler[HANDLER_STREAMING] === STREAM_RESPONSE) {
    return STREAM_RESPONSE
  }
  throw new MalformedStreamingHandler("Only response streaming is supported.")
}

function _highWaterMark(handler) {
  if (
    handler[HANDLER_HIGHWATERMARK] === undefined ||
    handler[HANDLER_HIGHWATERMARK] === null ||
    handler[HANDLER_HIGHWATERMARK] === false
  ) {
    return undefined
  }

  const hwm = Number.parseInt(handler[HANDLER_HIGHWATERMARK], 10)
  return Number.isNaN(hwm) ? undefined : hwm
}

/**
 * Load the user's function with the approot and the handler string.
 * @param appRoot {string}
 *   The path to the application root.
 * @param handlerString {string}
 *   The user-provided handler function in the form 'module.function'.
 * @return userFuction {function}
 *   The user's handler function. This function will be passed the event body,
 *   the context object, and the callback function.
 * @throws In five cases:-
 *   1 - if the handler string is incorrectly formatted an error is thrown
 *   2 - if the module referenced by the handler cannot be loaded
 *   3 - if the function in the handler does not exist in the module
 *   4 - if a property with the same name, but isn't a function, exists on the
 *       module
 *   5 - the handler includes illegal character sequences (like relative paths
 *       for traversing up the filesystem '..')
 *   Errors for scenarios known by the runtime, will be wrapped by Runtime.* errors.
 */
module.exports.load = async function (appRoot, fullHandlerString) {
  _throwIfInvalidHandler(fullHandlerString)

  const [moduleRoot, moduleAndHandler] =
    _moduleRootAndHandler(fullHandlerString)
  const [module, handlerPath] = _splitHandlerString(moduleAndHandler)

  const userApp = await _loadUserApp(appRoot, moduleRoot, module)
  const handlerFunc = _resolveHandler(userApp, handlerPath)

  if (!handlerFunc) {
    throw new HandlerNotFound(
      `${fullHandlerString} is undefined or not exported`,
    )
  }

  if (typeof handlerFunc !== "function") {
    throw new HandlerNotFound(`${fullHandlerString} is not a function`)
  }

  return handlerFunc
}

module.exports.isHandlerFunction = function (value) {
  return typeof value === "function"
}

module.exports.getHandlerMetadata = function (handlerFunc) {
  return {
    highWaterMark: _highWaterMark(handlerFunc),
    streaming: _isHandlerStreaming(handlerFunc),
  }
}

module.exports.STREAM_RESPONSE = STREAM_RESPONSE
