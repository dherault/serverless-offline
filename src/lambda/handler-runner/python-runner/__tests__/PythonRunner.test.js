import assert from "node:assert"
import { env } from "node:process"
import PythonRunner from "../PythonRunner.js"

const handlerPath =
  "src/lambda/handler-runner/python-runner/__tests__/fixtures/handler"

function createPythonRunner(handlerName) {
  return new PythonRunner(
    {
      handler: `${handlerPath}.${handlerName}`,
      runtime: "python3.12",
    },
    {},
  )
}

describe("PythonRunner", function desc() {
  let pythonRunner

  before(function before() {
    // Could not find 'Python 3' executable, skipping 'Python' tests.
    if (!env.PYTHON3_DETECTED) {
      this.skip()
    }
  })

  afterEach(() => {
    pythonRunner?.cleanup()
    pythonRunner = undefined
  })

  it("should return the result of the handler", async () => {
    pythonRunner = createPythonRunner("echo_handler")

    assert.deepStrictEqual(await pythonRunner.run({ foo: "bar" }, {}), {
      foo: "bar",
    })
  })

  it("should return the result of consecutive invocations", async () => {
    pythonRunner = createPythonRunner("echo_handler")

    assert.deepStrictEqual(await pythonRunner.run({ n: 1 }, {}), { n: 1 })
    assert.deepStrictEqual(await pythonRunner.run({ n: 2 }, {}), { n: 2 })
  })

  // falsy results used to never resolve
  it("should return null when the handler returns None", async () => {
    pythonRunner = createPythonRunner("none_handler")

    assert.strictEqual(await pythonRunner.run({}, {}), null)
  })

  it("should return 0 when the handler returns 0", async () => {
    pythonRunner = createPythonRunner("zero_handler")

    assert.strictEqual(await pythonRunner.run({}, {}), 0)
  })

  it("should reject with the exception of the handler", async () => {
    pythonRunner = createPythonRunner("raise_handler")

    await assert.rejects(pythonRunner.run({}, {}), {
      message: "boom",
      name: "ValueError",
    })
  })

  it("should keep working after the handler raised", async () => {
    pythonRunner = createPythonRunner("raise_handler")

    await assert.rejects(pythonRunner.run({}, {}))
    await assert.rejects(pythonRunner.run({}, {}), { message: "boom" })
  })

  it("should base64 encode a bytes body", async () => {
    pythonRunner = createPythonRunner("bytes_body_handler")

    assert.deepStrictEqual(await pythonRunner.run({}, {}), {
      body: "aGVsbG8=",
      isBase64Encoded: true,
      statusCode: 200,
    })
  })

  it("should serialize a Decimal like the AWS runtime", async () => {
    pythonRunner = createPythonRunner("decimal_handler")

    assert.deepStrictEqual(await pythonRunner.run({}, {}), { value: 1.5 })
  })

  it("should reject when the handler exits the process", async () => {
    pythonRunner = createPythonRunner("exit_handler")

    await assert.rejects(pythonRunner.run({}, {}), /exited unexpectedly/)
  })

  it("should reject when the handler can't be imported", async () => {
    pythonRunner = createPythonRunner("does_not_exist")

    await assert.rejects(pythonRunner.run({}, {}), /exited/)
  })
})
