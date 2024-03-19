import express from "express"
import serverless from "serverless-http"

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/api/info", (req, res) => {
  res.send({
    application: "sample-app",
    foo: "bar",
  })
})

app.post("/api/foo", (req, res) => {
  res.send({
    ...req.body,
  })
})

export default serverless(app)
