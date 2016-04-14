const chalk = require('chalk');
const isPlainObject = require('lodash.isplainobject');
const isDebug = require('../utils/isDebug');

// An action creator takes a plain object as input (params) 
// and outputs a redux-style action ({ params, type[s], [promise] });

const ac = {};

/* Sync Action Creators */

ac.setOptions = createSyncActionCreator('setOptions');
ac.setEnvironment = createSyncActionCreator('setEnvironment');

/* Async Action Creators */

/* Utilities */

const logAction = isDebug ?
  console.log.bind(null, chalk.bgGreen('_.A._')) :
  (() => undefined);

// Creates async actionCreators that calls the GraphQL endpoint
function createAsyncActionCreator(intention) {
  const types = ['REQUEST', 'SUCCESS', 'FAILURE'].map(createTypeFromIntention.bind(null, intention));
  
  return (params, promise) => {
    
    logAction(intention, params);
    validateParams(params);
    
    return { types, params, promise };
  };
}

// Reduces boilerplate, ensures logging and validates params
function createSyncActionCreator(intention) {
  const type = createTypeFromIntention(intention);
  
  return params => {
    logAction(intention, params);
    validateParams(params);
    
    return { type, params };
  };
}

// doSomeStuff --> DO_SOME_STUFF
// An action has one intention (camel-cased), but can have multiple types (caps, _-separated)
function createTypeFromIntention(intention, prefix) {
  return `${prefix ? prefix + '_' :  ''}${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase();
}

function validateParams(params) {
  if (!isPlainObject(params)) throw new Error('In action: params must be a plain object!');
}
