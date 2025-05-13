import middy from "@middy/core"
import httpEventNormalizer from "@middy/http-event-normalizer"
import jsonBodyParser from "@middy/http-json-body-parser"

const { stringify } = JSON

const handler = () => {
  return {
    foo: "bar",
  }
}

const jsonHandler = (statusCode) => ({
  after(request) {
    request.response = {
      body: stringify(request.response),
      headers: {
        "Content-Type": "application/json",
      },
      statusCode,
    }
  },

  onError(request) {
    request.response = {
      body: stringify(request.response.body),
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: request.response.statusCode,
    }
  },
})

export default middy(handler)
  .use(httpEventNormalizer())
  .use(jsonBodyParser())
  .use(jsonHandler(200))
