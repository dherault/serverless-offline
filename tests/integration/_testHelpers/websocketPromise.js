const websocketSend = (ws, data) =>
  new Promise((res) => {
    ws.on('open', () => {
      ws.send(data, (e) => {
        if (e) {
          res({ err: e })
        }
      })
    })
    ws.on('close', (c) => {
      res({ code: c })
    })
    ws.on('message', (d) => {
      res({ data: d })
    })
    ws.on('error', (e) => {
      res({ err: e })
    })
    setTimeout(() => {
      res({})
    }, 5000)
  })

export default websocketSend
