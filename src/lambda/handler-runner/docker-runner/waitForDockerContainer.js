import { setTimeout } from "node:timers/promises"

export default async function waitForDockerContainer(url) {
  const signal = AbortSignal.timeout(5000)

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
        await setTimeout(100)
      }
    }
  }

  throw new Error(`Docker container did not become ready at ${url}`)
}
