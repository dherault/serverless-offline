import { log } from "../../../../utils/log.js"

export default function catchAllRoute() {
  return {
    handler(request, h) {
      const { url } = request

      log.debug(`got GET to ${url}`)

      return h.response(null).code(426)
    },

    method: "GET",
    path: "/{path*}",
  }
}
