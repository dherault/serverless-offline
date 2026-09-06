import { setTimeout } from "node:timers/promises"

// the runtime logs that it started before its HTTP listener accepts requests,
// the probe bridges that gap. the deadline also bounds a connection that is
// accepted but never answers
const READINESS_TIMEOUT = 5000
const RETRY_INTERVAL = 100

export default async function waitForDockerContainer(url) {
  const signal = AbortSignal.timeout(READINESS_TIMEOUT)

  while (!signal.aborted) {
    try {
      // GET / does not invoke a function. Even a 404 proves the listener is up.
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url, { redirect: "manual", signal })
      // eslint-disable-next-line no-await-in-loop
      await response.body?.cancel().catch(() => undefined)
      return
    } catch {
      if (!signal.aborted) {
        // eslint-disable-next-line no-await-in-loop
        await setTimeout(RETRY_INTERVAL)
      }
    }
  }

  throw new Error(`Docker container did not become ready at ${url}`)
}
