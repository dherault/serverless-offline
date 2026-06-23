const { stringify } = JSON

export async function timeoutHandler() {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })

  return {
    body: stringify("foo"),
    statusCode: 200,
  }
}

// sleeps past the timeout only when called with ?slow=true, so the same
// function can be made to time out once and then succeed instantly.
// the slow/fast decision comes from the request, not module state, so it
// survives the worker thread being recreated after a timeout.
export async function conditionalTimeoutHandler(event) {
  if (event.queryStringParameters?.slow === "true") {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
  }

  return {
    body: stringify("foo"),
    statusCode: 200,
  }
}
