// Cannot use module-scoped `let` here as on a reload the count would
// be 1 again. Thus, uses `globalThis`, which survives across
// separate module instantiations within the worker thread / process, and
// a reload is visible as an incrementing value instead of a false "1".
if (globalThis.handlerRunnerTsFixtureLoadCount === undefined) {
  globalThis.handlerRunnerTsFixtureLoadCount = 0
}

globalThis.handlerRunnerTsFixtureLoadCount += 1

const capturedLoadCount = globalThis.handlerRunnerTsFixtureLoadCount

export async function countingHandler() {
  return {
    loadCount: capturedLoadCount,
  }
}
