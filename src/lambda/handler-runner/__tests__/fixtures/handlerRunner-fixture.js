import process from "node:process"
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

// an uncaught exception terminates the worker thread
export function crashOnDemandHandler(event) {
  if (event.crash) {
    setTimeout(() => {
      throw new Error("uncaught exception")
    }, 0)

    return new Promise(() => {})
  }

  return Promise.resolve(event)
}

export function unhandledRejectionHandler() {
  Promise.reject(new Error("unhandled rejection"))

  return new Promise(() => {})
}

export function exitHandler() {
  process.exit(0)
}

export async function throwStringHandler() {
  // eslint-disable-next-line no-throw-literal
  throw "string error"
}

export function callbackStringErrorHandler(event, context, callback) {
  callback("string error")
}

// own function properties can't be structured cloned
export async function nonCloneableResultHandler() {
  return {
    body: "foo",
    statusCode: 200,
    toString() {
      return "foo"
    },
  }
}
