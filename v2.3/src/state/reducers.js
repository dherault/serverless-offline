'use strict';

module.exports = {
  
  environment: (state, action) => action.type === 'SET_ENVIRONMENT' ? action.params : state || {},
  
  options: (state, action) => action.type === 'SET_OPTIONS' ? action.params : state || {},
  
  records: (state, action) => (state || []).concat([Object.assign({ date: Date.now() }, action)]),
};
