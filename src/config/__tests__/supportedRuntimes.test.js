import assert from "node:assert"
import Runtime from "../../lambda/handler-runner/docker-runner/DockerRuntime.js"
import {
  supportedNodejs,
  supportedRuntimes,
  supportedRuntimesArchitecture,
} from "../supportedRuntimes.js"

const nodejsRuntimes = ["nodejs20.x", "nodejs22.x", "nodejs24.x", "nodejs26.x"]

describe("supportedRuntimes", () => {
  nodejsRuntimes.forEach((runtime) => {
    it(`should list ${runtime} as a supported node.js runtime`, () => {
      assert.ok(supportedNodejs.has(runtime))
      assert.ok(supportedRuntimes.has(runtime))
    })

    it(`should support both architectures for ${runtime}`, () => {
      assert.deepEqual(supportedRuntimesArchitecture[runtime], [
        "arm64",
        "x86_64",
      ])
    })
    ;["arm64", "x86_64"].forEach((architecture) => {
      it(`should resolve the docker image tag for ${runtime} on ${architecture}`, () => {
        const expected = `nodejs:${runtime.slice(6, -2)}-${architecture}`

        assert.equal(
          new Runtime().getImageNameTag(runtime, architecture),
          expected,
        )
      })
    })
  })
})
