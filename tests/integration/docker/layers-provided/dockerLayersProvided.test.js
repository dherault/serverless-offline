import assert from "node:assert"
import { env } from "node:process"
import { join } from "desm"
import { setup, teardown } from "../../../_testHelpers/index.js"
import { BASE_URL } from "../../../config.js"

describe("Custom runtime from a layer with Docker tests", function desc() {
  beforeEach(() =>
    setup({
      // The local layer has to work without AWS credentials. The service runs
      // without the environment of the test process, keeping only what docker
      // and the serverless binary need, and the AWS SDK is pointed at
      // credential files which do not exist: no environment credentials, no
      // profile, no container credentials and no instance metadata.
      env: {
        AWS_CONFIG_FILE: join(import.meta.url, "no-aws-config"),
        AWS_EC2_METADATA_DISABLED: "true",
        AWS_SHARED_CREDENTIALS_FILE: join(
          import.meta.url,
          "no-aws-credentials",
        ),
        DOCKER_HOST: env.DOCKER_HOST,
        HOME: env.HOME,
        PATH: env.PATH,
        SystemRoot: env.SystemRoot,
        USERPROFILE: env.USERPROFILE,
      },
      extendEnv: false,
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description:
        "should run the bootstrap of a layer and expose the layer under /opt",
      expected: {
        message: "Hello from a local layer!",
      },
      path: "/dev/hello",
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async function it() {
      // "Could not find 'Docker', skipping tests."
      if (!env.DOCKER_DETECTED) {
        this.skip()
      }

      const url = new URL(path, BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
