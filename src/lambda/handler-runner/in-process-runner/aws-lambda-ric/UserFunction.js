/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

"use strict"

const { pathToFileURL } = require("node:url")

// node_modules/lambda-runtime/dist/node16/UserFunction.js
;(function () {
  const __getOwnPropNames = Object.getOwnPropertyNames
  const __commonJS = (cb, mod) =>
    function __require() {
      return (
        mod ||
          (0, cb[__getOwnPropNames(cb)[0]])(
            (mod = { exports: {} }).exports,
            mod,
          ),
        mod.exports
      )
    }
  const require_Errors = __commonJS({
    "Errors.js": function (exports2, module2) {
      "use strict"

      const util = require("node:util")
      function _isError(obj) {
        return (
          obj &&
          obj.name &&
          obj.message &&
          obj.stack &&
          typeof obj.name === "string" &&
          typeof obj.message === "string" &&
          typeof obj.stack === "string"
        )
      }
      function intoError(err) {
        if (err instanceof Error) {
          return err
        }
        return new Error(err)
      }
      module2.exports.intoError = intoError
      function toRapidResponse(error) {
        try {
          if (util.types.isNativeError(error) || _isError(error)) {
            return {
              errorType: error.name,
              errorMessage: error.message,
              trace: error.stack.split("\n"),
            }
          }
          return {
            errorType: typeof error,
            errorMessage: error.toString(),
            trace: [],
          }
        } catch {
          return {
            errorType: "handled",
            errorMessage:
              "callback called with Error argument, but there was a problem while retrieving one or more of its message, name, and stack",
          }
        }
      }
      module2.exports.toRapidResponse = toRapidResponse
      module2.exports.toFormatted = (error) => {
        try {
          return `      ${JSON.stringify(error, (_k, v) =>
            _withEnumerableProperties(v),
          )}`
        } catch {
          return `      ${JSON.stringify(toRapidResponse(error))}`
        }
      }
      function _withEnumerableProperties(error) {
        if (error instanceof Error) {
          const ret = {
            errorType: error.name,
            errorMessage: error.message,
            code: error.code,
            ...error,
          }
          if (typeof error.stack === "string") {
            ret.stack = error.stack.split("\n")
          }
          return ret
        }
        return error
      }
      const errorClasses = [
        class ImportModuleError extends Error {},
        class HandlerNotFound extends Error {},
        class MalformedHandlerName extends Error {},
        class UserCodeSyntaxError extends Error {},
        class MalformedStreamingHandler extends Error {},
        class InvalidStreamingOperation extends Error {},
        class UnhandledPromiseRejection extends Error {
          constructor(reason, promise) {
            super(reason)
            this.reason = reason
            this.promise = promise
          }
        },
      ]
      errorClasses.forEach((e) => {
        module2.exports[e.name] = e
        e.prototype.name = `Runtime.${e.name}`
      })
    },
  })
  const require_VerboseLog = __commonJS({
    "VerboseLog.js": function (exports2) {
      "use strict"

      const EnvVarName = "AWS_LAMBDA_RUNTIME_VERBOSE"
      const Tag = "RUNTIME"
      const Verbosity = (() => {
        if (!process.env[EnvVarName]) {
          return 0
        }
        try {
          const verbosity = Number.parseInt(process.env[EnvVarName])
          return verbosity < 0 ? 0 : verbosity > 3 ? 3 : verbosity
        } catch {
          return 0
        }
      })()
      exports2.logger = function (category) {
        return {
          verbose() {
            if (Verbosity >= 1) {
              Reflect.apply(console.log, null, [Tag, category, ...arguments])
            }
          },
          vverbose() {
            if (Verbosity >= 2) {
              Reflect.apply(console.log, null, [Tag, category, ...arguments])
            }
          },
          vvverbose() {
            if (Verbosity >= 3) {
              Reflect.apply(console.log, null, [Tag, category, ...arguments])
            }
          },
        }
      }
    },
  })
  const require_HttpResponseStream = __commonJS({
    "HttpResponseStream.js": function (exports2, module2) {
      "use strict"

      const METADATA_PRELUDE_CONTENT_TYPE =
        "application/vnd.awslambda.http-integration-response"
      const DELIMITER_LEN = 8
      const HttpResponseStream2 = class {
        static from(underlyingStream, prelude) {
          underlyingStream.setContentType(METADATA_PRELUDE_CONTENT_TYPE)
          const metadataPrelude = JSON.stringify(prelude)
          underlyingStream._onBeforeFirstWrite = (write) => {
            write(metadataPrelude)
            write(new Uint8Array(DELIMITER_LEN))
          }
          return underlyingStream
        }
      }
      module2.exports.HttpResponseStream = HttpResponseStream2
    },
  })
  const path = require("node:path")
  const fs = require("node:fs")
  const {
    HandlerNotFound,
    MalformedHandlerName,
    ImportModuleError,
    UserCodeSyntaxError,
  } = require_Errors()
  const { verbose } = require_VerboseLog().logger("LOADER")
  const { HttpResponseStream } = require_HttpResponseStream()
  const FUNCTION_EXPR = /^([^.]*)\.(.*)$/
  const RELATIVE_PATH_SUBSTRING = ".."
  const HANDLER_STREAMING = Symbol.for("aws.lambda.runtime.handler.streaming")
  const STREAM_RESPONSE = "response"
  const NoGlobalAwsLambda =
    process.env.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA === "1" ||
    process.env.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA === "true"
  function _moduleRootAndHandler(fullHandlerString) {
    const handlerString = path.basename(fullHandlerString)
    const moduleRoot = fullHandlerString.substring(
      0,
      fullHandlerString.indexOf(handlerString),
    )
    return [moduleRoot, handlerString]
  }
  function _splitHandlerString(handler) {
    const match = handler.match(FUNCTION_EXPR)
    if (!match || match.length != 3) {
      throw new MalformedHandlerName("Bad handler")
    }
    return [match[1], match[2]]
  }
  function _resolveHandler(object, nestedProperty) {
    return nestedProperty.split(".").reduce((nested, key) => {
      return nested && nested[key]
    }, object)
  }
  function _tryRequireFile(file, extension) {
    const path2 = file + (extension || "")
    verbose("Try loading as commonjs:", path2)
    return fs.existsSync(path2) ? require(path2) : void 0
  }
  async function _tryAwaitImport(file, extension) {
    const path2 = file + (extension || "")
    verbose("Try loading as esmodule:", path2)
    if (fs.existsSync(path2)) {
      return await import(pathToFileURL(path2).href)
    }
    return void 0
  }
  function _hasFolderPackageJsonTypeModule(folder) {
    if (folder.endsWith("/node_modules")) {
      return false
    }
    const pj = path.join(folder, "/package.json")
    if (fs.existsSync(pj)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pj))
        if (pkg) {
          if (pkg.type === "module") {
            verbose(`'type: module' detected in ${pj}`)
            return true
          }
          verbose(`'type: module' not detected in ${pj}`)
          return false
        }
      } catch (e) {
        console.warn(
          `${pj} cannot be read, it will be ignored for ES module detection purposes.`,
          e,
        )
        return false
      }
    }
    if (folder === "/") {
      return false
    }
    return _hasFolderPackageJsonTypeModule(path.resolve(folder, ".."))
  }
  function _hasPackageJsonTypeModule(file) {
    const jsPath = `${file}.js`
    return fs.existsSync(jsPath)
      ? _hasFolderPackageJsonTypeModule(path.resolve(path.dirname(jsPath)))
      : false
  }
  async function _tryRequire(appRoot, moduleRoot, module2) {
    verbose(
      "Try loading as commonjs: ",
      module2,
      " with paths: ,",
      appRoot,
      moduleRoot,
    )
    const lambdaStylePath = path.resolve(appRoot, moduleRoot, module2)
    const extensionless = _tryRequireFile(lambdaStylePath)
    if (extensionless) {
      return extensionless
    }
    const pjHasModule = _hasPackageJsonTypeModule(lambdaStylePath)
    if (!pjHasModule) {
      const loaded2 = _tryRequireFile(lambdaStylePath, ".js")
      if (loaded2) {
        return loaded2
      }
    }
    const loaded =
      (pjHasModule && (await _tryAwaitImport(lambdaStylePath, ".js"))) ||
      (await _tryAwaitImport(lambdaStylePath, ".mjs")) ||
      _tryRequireFile(lambdaStylePath, ".cjs")
    if (loaded) {
      return loaded
    }
    verbose(
      "Try loading as commonjs: ",
      module2,
      " with path(s): ",
      appRoot,
      moduleRoot,
    )
    const nodeStylePath = require.resolve(module2, {
      paths: [appRoot, moduleRoot],
    })
    return require(nodeStylePath)
  }
  async function _loadUserApp(appRoot, moduleRoot, module2) {
    if (!NoGlobalAwsLambda) {
      globalThis.awslambda = {
        streamifyResponse: (handler) => {
          handler[HANDLER_STREAMING] = STREAM_RESPONSE
          return handler
        },
        HttpResponseStream,
      }
    }
    try {
      return await _tryRequire(appRoot, moduleRoot, module2)
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new UserCodeSyntaxError(e)
      } else if (e.code !== void 0 && e.code === "MODULE_NOT_FOUND") {
        verbose(
          "globalPaths",
          JSON.stringify(require("node:module").globalPaths),
        )
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
  module.exports.load = async function (appRoot, fullHandlerString) {
    _throwIfInvalidHandler(fullHandlerString)
    const [moduleRoot, moduleAndHandler] =
      _moduleRootAndHandler(fullHandlerString)
    const [module2, handlerPath] = _splitHandlerString(moduleAndHandler)
    const userApp = await _loadUserApp(appRoot, moduleRoot, module2)
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
  module.exports.getHandlerMetadata = function (handlerFunc) {
    return {
      streaming: _isHandlerStreaming(handlerFunc),
    }
  }
  module.exports.STREAM_RESPONSE = STREAM_RESPONSE
})()
