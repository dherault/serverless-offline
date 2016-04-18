'use strict';

module.exports = {
  
  requests: (state, action) => {
    
    switch (action.type) {
      case 'CREATE_REQUEST':
        return Object.assign({
          [action.params.requestId]: {
            done: false,
            timeout: action.params.timeout,
          }
        }, state);
      
      case 'MARK_REQUEST_DONE': {
        const newState = Object.assign({}, state);
        
        newState[action.params.requestId].done = true;
        clearTimeout(newState[action.params.requestId].timeout); // purity?
        return newState;
      }
      
      default:
        return state || {};
    }
  },
  
  environment: (state, action) => action.type === 'SET_ENVIRONMENT' ? action.params : state || {},
  
  options: (state, action) => action.type === 'SET_OPTIONS' ? action.params : state || {},
  
  // records: (state, action) => (state || []).concat([Object.assign({ date: Date.now() }, action)]),
};
