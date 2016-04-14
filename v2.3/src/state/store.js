'use strict';

const redux = require('redux');
const chalk = require('chalk');
const isDebug = require('../utils/isDebug');

function loggingMiddleware() {
  return next => action => {
    if (isDebug) console.log(chalk.bgBlue('_.R._'), action.type, action.payload || '');
    next(action);
  };
}
 
function promiseMiddleware(store) {
  return next => action => {
    
    if (!action.promise) return next(action);
    
    const types = action.types;
    const params = action.params;
    
    next({ params, type: action.types[0] });
    
    action.promise
    .then(payload => next({ params, payload, type: types[1] }))
    .catch(payload => next({ params, payload, type: types[2] }));
  };
}

// App creation
module.exports = redux.createStore(
  redux.combineReducers(require('./reducers')),               // reducer
  {},                                                         // initial state
  redux.applyMiddleware(promiseMiddleware, loggingMiddleware) // enhancer
);
