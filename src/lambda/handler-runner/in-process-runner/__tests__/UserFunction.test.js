import assert from "node:assert"
import { execFile } from "node:child_process"
import { execPath } from "node:process"
import { promisify } from "node:util"
import { join } from "desm"

const execFileAsync = promisify(execFile)

const appRoot = join(import.meta.url, "fixtures")
const userFunctionPath = join(
  import.meta.url,
  "..",
  "aws-lambda-ric",
  "UserFunction.js",
)

// tsx's ES module loader needs module.register(), which Node only ships from
// v20.6, whereas this package supports Node v20 and above. Deleting the
// builtin's export is the very condition tsx feature-detects, so it reproduces
// such an older runtime without having to install one.
const loadWithoutModuleRegister = `
  const nodeModule = require("node:module")

  delete nodeModule.register
  delete nodeModule.registerHooks

  require(${JSON.stringify(userFunctionPath)})
    .load(${JSON.stringify(appRoot)}, "userFunction-fixture-ts.handler")
    .then((handler) => handler())
    .then((result) => {
      console.log(JSON.stringify(result))
    })
`

describe("UserFunction", () => {
  it("should fall back to commonjs when tsx's ES module loader is unavailable", async () => {
    const { stderr, stdout } = await execFileAsync(execPath, [
      "-e",
      loadWithoutModuleRegister,
    ])

    assert.deepStrictEqual(JSON.parse(stdout), { loaded: true })
    assert.match(stderr, /tsx's ES module loader is unavailable/)
  })
})
