const chalk = require('chalk');
const isPlainObject = require('lodash.isplainobject');
const isDebug = require('../utils/isDebug');

// An action creator takes a plain object as input (params) 
// and outputs a redux-style action ({ params, type });

const actionCreators = {
  setOptions: createActionCreator('setOptions'),
  setEnvironment: createActionCreator('setEnvironment'),
  createRequest: createActionCreator('createRequest'),
  markRequestDone: createActionCreator('markRequestDone'),
};

/* Utilities */

const logAction = isDebug ?
  console.log.bind(null, chalk.bgGreen('_.A._')) :
  (() => undefined);

// Reduces boilerplate, ensures logging and validates params
function createActionCreator(intention) {
  
  // doSomeStuff --> DO_SOME_STUFF
  const type = `${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase();
  
  return params => {
    logAction(intention, params);
    
    if (!isPlainObject(params)) throw new Error('In action: params must be a plain object!');
    
    return { type, params };
  };
}

module.exports = require('redux').bindActionCreators(actionCreators, require('./store').dispatch);
