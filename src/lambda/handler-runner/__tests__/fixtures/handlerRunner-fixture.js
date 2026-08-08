import { isMainThread } from "node:worker_threads"

// the only reliable way to tell the worker thread runner and the in-process
// runner apart from inside a handler
export async function runModeHandler() {
  return {
    isMainThread,
  }
}

export async function echoHandler(event) {
  return event
}
