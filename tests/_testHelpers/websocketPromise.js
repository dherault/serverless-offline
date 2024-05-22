export default function websocketSend(ws, data) {
  return new Promise((res) => {
    ws.on("open", () => {
      ws.send(data, (err) => {
        if (err) {
          res({ err })
        }
      })
    })

    ws.on("close", (code) => {
      res({ code })
    })

    ws.on("error", (err) => {
      res({ err })
    })

    ws.on("message", (d, isBinary) => {
      const message = isBinary ? d : String(d)
      res({ data: message })
    })

    setTimeout(() => {
      res({})
    }, 5000)
  })
}
