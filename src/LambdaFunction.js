'use strict';

const LambdaContext = require('./LambdaContext.js');
const functionHelper = require('./functionHelper.js');

// https://docs.aws.amazon.com/lambda/latest/dg/limits.html
// default function timeout in seconds
const DEFAULT_TIMEOUT = 900; // 15 min

module.exports = class LambdaFunction {
  constructor(config, options) {
    this._config = config;
    this._executionTimeEnded = null;
    this._executionTimeStarted = null;
    this._options = options;
  }

  _startExecutionTimer() {
    this._executionTimeStarted = new Date().getTime();
  }

  _stopExecutionTimer() {
    this._executionTimeEnded = new Date().getTime();
  }

  addEvent(event) {
    this._event = event;
  }

  getExecutionTimeInMillis() {
    return this._executionTimeEnded - this._executionTimeStarted;
  }

  async runHandler() {
    const {
      functionName,
      lambdaName,
      memorySize,
      timeout = DEFAULT_TIMEOUT,
    } = this._config;

    const lambdaContext = new LambdaContext({
      getRemainingTimeInMillis: () => {
        const timeEnd = this._executionTimeStarted + timeout * 1000;
        const time = timeEnd - new Date().getTime();

        // just return 0 for now if we are beyond alotted time (timeout)
        return time > 0 ? time : 0;
      },
      lambdaName,
      memorySize,
    });

    const contextCalled = new Promise((resolve, reject) => {
      lambdaContext.once('contextCalled', (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    let callback;

    const callbackCalled = new Promise((resolve, reject) => {
      callback = (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      };
    });

    const context = lambdaContext.getContext();

    this._startExecutionTimer();

    const handler = functionHelper.createHandler(this._config, this._options);

    let result;

    try {
      result = handler(this._event, context, callback);
    } catch (err) {
      // this only executes when we have an exception caused by syncronous code
      // TODO logging
      console.log(err);
      throw new Error(`Uncaught error in '${functionName}' handler.`);
    }

    // // not a Promise, which is not supported by aws
    // if (result == null || typeof result.then !== 'function') {
    //   throw new Error(`Syncronous function execution is not supported.`);
    // }

    const callbacks = [contextCalled, callbackCalled];

    // Promise was returned
    if (result != null && typeof result.then === 'function') {
      callbacks.push(result);
    }

    let callbackResult;

    try {
      callbackResult = await Promise.race(callbacks);
    } catch (err) {
      // TODO logging
      console.log(err);
      throw err;
    }

    this._stopExecutionTimer();

    return callbackResult;
  }
};
