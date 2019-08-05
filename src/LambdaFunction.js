'use strict';

const functionHelper = require('./functionHelper.js');
const LambdaContext = require('./LambdaContext.js');
const { createUniqueId } = require('./utils/index.js');
const { DEFAULT_LAMBDA_TIMEOUT } = require('./config/index.js');

const { now } = Date;

module.exports = class LambdaFunction {
  constructor(config, options) {
    this._awsRequestId = null;
    this._config = config;
    this._executionTimeEnded = null;
    this._executionTimeStarted = null;
    this._executionTimeout = null;
    this._options = options;
  }

  _startExecutionTimer() {
    const { timeout = DEFAULT_LAMBDA_TIMEOUT } = this._config;

    this._executionTimeStarted = now();
    this._executionTimeout = this._executionTimeStarted + timeout * 1000;
  }

  _stopExecutionTimer() {
    this._executionTimeEnded = now();
  }

  addEvent(event) {
    this._event = event;
  }

  getExecutionTimeInMillis() {
    return this._executionTimeEnded - this._executionTimeStarted;
  }

  getAwsRequestId() {
    return this._awsRequestId;
  }

  async runHandler() {
    const { functionName, lambdaName, memorySize } = this._config;

    this._awsRequestId = createUniqueId();

    const lambdaContext = new LambdaContext({
      awsRequestId: this._awsRequestId,
      getRemainingTimeInMillis: () => {
        const time = this._executionTimeout - now();

        // just return 0 for now if we are beyond alotted time (timeout)
        return time > 0 ? time : 0;
      },
      lambdaName,
      memorySize,
    });

    let callback;

    const callbackCalled = new Promise((resolve, reject) => {
      callback = (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      };

      lambdaContext.once('contextCalled', callback);
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

    const callbacks = [callbackCalled];

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
