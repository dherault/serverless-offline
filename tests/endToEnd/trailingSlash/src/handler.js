const { stringify } = JSON

export const echo = async (event) => {
  return {
    body: stringify({
      path: event.path,
      resource: event.resource,
    }),
    statusCode: 200,
  }
}
