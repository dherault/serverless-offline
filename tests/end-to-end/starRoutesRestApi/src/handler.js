const { stringify } = JSON

export const hello = async (event) => {
  return {
    body: stringify({
      path: event.path,
      resource: event.resource,
    }),
    statusCode: 200,
  }
}
