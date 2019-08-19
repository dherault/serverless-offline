'use strict'

const { resolve } = require('path')
const { node } = require('execa')

const { parse, stringify } = JSON

// TODO FIXME we should probably call invokeLocal from the plugin directly
// instead of spawning a new process

// TODO FIXME file bug: 'execa v2.0.3' claims to get rid of newlines:
// https://github.com/sindresorhus/execa#stripfinalnewline
// might be a bug, as it seems to be not working
// when fixed, remove trimNewlines module

module.exports = class ServerlessInvokeLocalRunner {
  constructor(funOptions, stage) {
    this._funOptions = funOptions
    this._stage = stage
  }

  run(event, context) {
    const { functionName, serverlessPath, servicePath } = this._funOptions

    const serverlessExecPath = resolve(serverlessPath, '../bin/serverless.js')
    const args = ['invoke', 'local', '-f', functionName]

    if (this._stage) {
      args.push('-s', this._stage)
    }

    const subprocess = node(serverlessExecPath, args, {
      cwd: servicePath,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    subprocess.stdin.write(`${stringify(event)}\n`)
    subprocess.stdin.end()

    let results = ''

    subprocess.stdout.on('data', (data) => {
      const str = data.toString('utf-8')
      results += str
      if (str.length > 0) {
        console.log('Proxy Handler Log:', str)
      }
    })

    subprocess.stderr.on('data', (data) => {
      context.fail(data)
    })

    subprocess.on('close', (code) => {
      if (code.toString() === '0') {
        try {
          // Strip all newlines out of the result string. This is required because of the way the buffer stream
          // adds newlines at each additional chunk, which corrupts the JSON structure if it is sufficiently
          // large.
          const resultsWithoutNewLines = results.replace(/\r?\n|\r/g, '')
          // Search for the last instance of something matching the JSON result structure. We look for the last
          // instance so that we don't accidentally pick up something that looks like the response that has
          // been manually printed in the handler code.
          // https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
          const proxyResponseRegex = /{[\r\n]?\s*(['"])isBase64Encoded(['"])|{[\r\n]?\s*(['"])statusCode(['"])|{[\r\n]?\s*(['"])headers(['"])|{[\r\n]?\s*(['"])body(['"])|{[\r\n]?\s*(['"])principalId(['"])/g
          let jsonResponse = null
          let match = null
          // eslint-disable-next-line no-cond-assign
          while ((match = proxyResponseRegex.exec(resultsWithoutNewLines))) {
            if (match && match.index > -1) {
              jsonResponse = resultsWithoutNewLines.slice(match.index)
            }
          }
          context.succeed(parse(jsonResponse))
        } catch (ex) {
          context.fail(results)
        }
      } else {
        context.succeed(code, results)
      }
    })
  }
}
