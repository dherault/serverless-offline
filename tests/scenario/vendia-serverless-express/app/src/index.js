'use strict'

const serverlessExpress = require('@vendia/serverless-express')
const app = require('./app.js')

exports.handler = serverlessExpress({ app })
