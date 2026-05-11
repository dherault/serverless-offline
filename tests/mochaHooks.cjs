"use strict"

const { env } = require("node:process")

exports.mochaHooks = {
  async beforeAll() {
    // Check if SERVERLESS_ACCESS_KEY is set before running any tests
    if (!env.SERVERLESS_ACCESS_KEY) {
      console.error("\n")
      console.error(
        "❌ SERVERLESS_ACCESS_KEY environment variable is required to run tests.",
      )
      console.error("\n")
      console.error("To fix this:")
      console.error("1. Get your Serverless API key:")
      console.error("   - Run: npx serverless login")
      console.error(
        "   - Or visit: https://app.serverless.com/ → Settings → Access Keys",
      )
      console.error("\n")
      console.error("2. Export the key:")
      console.error("   export SERVERLESS_ACCESS_KEY=your_key_here")
      console.error("\n")
      console.error("3. Run tests again:")
      console.error("   npm test")
      console.error("\n")
      process.exit(1)
    }

    const { checkDockerDaemon, checkGoVersion, detectExecutable } =
      await import("../src/utils/index.js")

    const executables = ["java", "python3", "ruby"]

    async function detectDocker() {
      try {
        await checkDockerDaemon()
      } catch {
        return false
      }
      return true
    }

    const [java, python3, ruby] = await Promise.all(
      executables.map((executable) =>
        executable === "java"
          ? detectExecutable("java", "-version")
          : detectExecutable(executable),
      ),
    )

    const docker = await detectDocker()

    if (docker) {
      env.DOCKER_DETECTED = true

      const dockerCompose = await detectExecutable("docker-compose")

      if (dockerCompose) {
        env.DOCKER_COMPOSE_DETECTED = true
      }
    }

    const go = await checkGoVersion()

    if (go === "1.x") {
      env.GO1X_DETECTED = true
    }

    if (java) {
      env.JAVA_DETECTED = true
    }

    if (python3) {
      env.PYTHON3_DETECTED = true
    }

    if (ruby) {
      env.RUBY_DETECTED = true
    }
  },
}
