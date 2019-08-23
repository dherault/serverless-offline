'use strict'

const { join } = require('path')
const { splitHandlerPathAndName } = require('../../src/utils/index.js')

function getFunctionOptions(
  functionName,
  functionObj,
  servicePath,
  serviceRuntime,
) {
  const { handler, memorySize, name, runtime, timeout } = functionObj
  const [handlerPath, handlerName] = splitHandlerPathAndName(handler)

  return {
    functionName,
    handlerName, // i.e. run
    handlerPath: join(servicePath, handlerPath),
    lambdaName: name,
    memorySize,
    runtime: runtime || serviceRuntime,
    timeout: (timeout || 30) * 1000,
  }
}

describe('getFunctionOptions', () => {
  const functionName = 'testFunction'
  const servicePath = 'src'

  let result
  beforeEach(() => {
    const functionObj = {
      handler: 'handler.hello',
    }
    result = getFunctionOptions(functionName, functionObj, servicePath)
  })

  test('should have the correct functionName', () => {
    expect(result.functionName).toEqual(functionName)
  })

  test('should have the correct handler name', () => {
    expect(result.handlerName).toEqual('hello')
  })

  test('should have the correct handler path', () => {
    expect(result.handlerPath).toEqual(join('src', 'handler'))
  })

  test('should have the default timeout', () => {
    expect(result.timeout).toEqual(30000)
  })

  test('should have babelOptions undefined', () => {
    expect(result.babelOptions).toEqual(undefined)
  })

  test('nested folders for handlers', () => {
    const functionObj = {
      handler: './somefolder/.handlers/handler.run',
    }
    const result = getFunctionOptions(functionName, functionObj, servicePath)
    expect(result.handlerName).toEqual('run')
    expect(result.handlerPath).toEqual(
      join('src', 'somefolder', '.handlers', 'handler'),
    )
  })

  describe('with a timeout', () => {
    beforeEach(() => {
      const functionObj = {
        handler: 'handler.hello',
        timeout: 7,
      }
      result = getFunctionOptions(functionName, functionObj, servicePath)
    })

    test('should have the correct timeout', () => {
      expect(result.timeout).toEqual(7000)
    })
  })
})
