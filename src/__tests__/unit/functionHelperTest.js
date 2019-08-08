'use strict'

const { join } = require('path')
const { getFunctionOptions } = require('../../functionHelper.js')

describe('functionHelper', () => {
  describe('#getFunctionOptions', () => {
    const functionName = 'testFunction'
    const servicePath = 'src'

    let result
    beforeEach(() => {
      const functionObj = {
        handler: 'handler.hello',
      }
      result = getFunctionOptions(functionObj, functionName, servicePath)
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
      const result = getFunctionOptions(functionObj, functionName, servicePath)
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
        result = getFunctionOptions(functionObj, functionName, servicePath)
      })

      test('should have the correct timeout', () => {
        expect(result.timeout).toEqual(7000)
      })
    })
  })
})
