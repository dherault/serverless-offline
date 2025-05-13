import { resolve } from "node:path"
import bodyParser from "body-parser"
import express from "express"

const app = express()

app.use(bodyParser.json())

app.get("/foo", (req, res) => {
  res.status(200).json({
    foo: "bar",
  })
})

app.get("/users/:userId", (req, res) => {
  res.status(404).json({})
})

app.post("/users", (req, res) => {
  res.status(201).send({
    ...req.body,
  })
})

app.get("/image", (req, res) => {
  res.sendFile(resolve(__dirname, "sam-logo.png"))
})

export default app
