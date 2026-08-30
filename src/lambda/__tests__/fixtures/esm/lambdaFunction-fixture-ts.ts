// Use module-scoped counter so that for a cached/reused module the value
// increments, and for a reloaded module always gets value 1
let invocationCount = 0

export async function statefulHandler() {
  invocationCount += 1

  return {
    invocationCount,
  }
}
