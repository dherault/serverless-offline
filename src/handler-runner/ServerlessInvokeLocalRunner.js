'use strict'

const { resolve } = require('path')
const { node } = require('execa')
const trimNewlines = require('trim-newlines')

const { parse, stringify } = JSON

// TODO FIXME we should probably call invokeLocal from the plugin directly
// instead of spawning a new process

// TODO FIXME file bug: 'execa v2.0.3' claims to get rid of newlines:
// https://github.com/sindresorhus/execa#stripfinalnewline
// might be a bug, as it seems to be not working
// when fixed, remove trimNewlines module

module.exports = class ServerlessInvokeLocalRunner {
  constructor(funOptions, options) {
    this._funOptions = funOptions
    this._options = options
  }

  run(event, context) {
    const { functionName, serverlessPath, servicePath } = this._funOptions

    const serverlessExecPath = resolve(serverlessPath, '../bin/serverless.js')
    const args = ['invoke', 'local', '-f', functionName]
    const stage = this._options.s || this._options.stage

    if (stage) {
      args.push('-s', stage)
    }

    const subprocess = node(serverlessExecPath, args, {
      cwd: servicePath,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    subprocess.stdin.write(`${stringify(event)}\n`)
    subprocess.stdin.end()

    const newlineRegex = /\r?\n|\r/g
    const proxyResponseRegex = /{[\r\n]?\s*('|")isBase64Encoded('|")|{[\r\n]?\s*('|")statusCode('|")|{[\r\n]?\s*('|")headers('|")|{[\r\n]?\s*('|")body('|")|{[\r\n]?\s*('|")principalId('|")/

    let results = ''
    let hasDetectedJson = false

    subprocess.stdout.on('data', (data) => {
      let str = data.toString('utf-8')
      // Search for the start of the JSON result
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
      const match = proxyResponseRegex.exec(str)
      if (match && match.index > -1) {
        // If we see a JSON result that looks like it could be a Lambda Proxy response,
        // we want to start treating the console output like it is the actual response.
        hasDetectedJson = true
        // Here we overwrite the existing reults. The last JSON match is the only one we want
        // to ensure that we don't accidentally start writing the results just because the
        // lambda program itself printed something that matched the regex string. The last match is
        // the correct one because it comes from sls invoke local after the lambda code fully executes.
        results = trimNewlines(str.slice(match.index))
        str = str.slice(0, match.index)
      }
      if (hasDetectedJson) {
        // Assumes that all data after matching the start of the
        // JSON result is the rest of the context result.
        results += trimNewlines(str)
      }
      if (str.length > 0) {
        // The data does not look like JSON and we have not
        // detected the start of JSON, so write the
        // output to the console instead.
        console.log('Proxy Handler could not detect JSON:', str)
      }
    })

    subprocess.stderr.on('data', (data) => {
      context.fail(data)
    })

    subprocess.on('close', (code) => {
      if (code.toString() === '0') {
        try {
          // This is a bit of an odd one. It looks like _process.stdout is chunking
          // data to the max buffer size (in my case, 65536) and adding newlines
          // between chunks.
          //
          // In my specific case, I was returning images encoded in the JSON response,
          // and these newlines were occuring at regular intervals (every 65536 chars)
          // and corrupting the response JSON. Not sure if this is the best way for
          // a general solution, but it fixed it in my case.
          //
          // Upside is that it will handle large JSON payloads correctly,
          // downside is that it will strip out any newlines that were supposed
          // to be in the response data.
          //
          // Open to comments about better ways of doing this!
          context.succeed(parse(results.replace(newlineRegex, '')))
        } catch (ex) {
          context.fail(results)
        }
      } else {
        context.succeed(code, results)
      }
    })
  }
}
