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
