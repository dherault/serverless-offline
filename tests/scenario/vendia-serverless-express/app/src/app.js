const { resolve } = require('node:path')
const express = require('express')

const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/foo', (req, res) => {
  res.status(200).json({
    foo: 'bar',
  })
})

app.get('/users/:userId', (req, res) => {
  res.status(404).json({})
})

app.post('/users', (req, res) => {
  res.status(201).send({
    ...req.body,
  })
})

app.get('/image', (req, res) => {
  res.sendFile(resolve(__dirname, 'sam-logo.png'))
})

module.exports = app
