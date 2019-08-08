'use strict'

const { spawn } = require('child_process')
const trimNewlines = require('trim-newlines')

const { parse, stringify } = JSON

module.exports = function runServerlessProxy(funOptions, options) {
  const { functionName, servicePath } = funOptions

  return (event, context) => {
    const args = ['invoke', 'local', '-f', functionName]
    const stage = options.s || options.stage

    if (stage) {
      args.push('-s', stage)
    }

    // Use path to binary if provided, otherwise assume globally-installed
    const binPath = options.b || options.binPath
    const cmd = binPath || 'sls'

    const subprocess = spawn(cmd, args, {
      cwd: servicePath,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    subprocess.stdin.write(`${stringify(event)}\n`)
    subprocess.stdin.end()

    let results = ''
    let hasDetectedJson = false

    subprocess.stdout.on('data', (data) => {
      let str = data.toString('utf8')

      if (hasDetectedJson) {
        // Assumes that all data after matching the start of the
        // JSON result is the rest of the context result.
        results += trimNewlines(str)
      } else {
        // Search for the start of the JSON result
        // https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
        const match = /{[\r\n]?\s*"isBase64Encoded"|{[\r\n]?\s*"statusCode"|{[\r\n]?\s*"headers"|{[\r\n]?\s*"body"|{[\r\n]?\s*"principalId"/.exec(
          str,
        )

        if (match && match.index > -1) {
          // The JSON result was in this chunk so slice it out
          hasDetectedJson = true
          results += trimNewlines(str.slice(match.index))
          str = str.slice(0, match.index)
        }

        if (str.length > 0) {
          // The data does not look like JSON and we have not
          // detected the start of JSON, so write the
          // output to the console instead.
          console.log('Proxy Handler could not detect JSON:', str)
        }
      }
    })

    subprocess.stderr.on('data', (data) => {
      context.fail(data)
    })

    subprocess.on('close', (code) => {
      if (code.toString() === '0') {
        try {
          context.succeed(parse(results))
        } catch (ex) {
          context.fail(results)
        }
      } else {
        context.succeed(code, results)
      }
    })
  }
}
