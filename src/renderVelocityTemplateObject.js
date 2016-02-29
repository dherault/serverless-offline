'use strict';

const render = require('../velocityjs-custom').render;
const isPlainObject = require('lodash.isplainobject');

// Set to true for debugging
const VERBOSE = true;

/* 
This function deeply traverses a plain object's keys (the serverless template, previously JSON)
When it finds a string, assumes it's Velocity language and renders it.
*/
module.exports = function renderVelocityTemplateObject(templateObject, context) {
  const result = {};
  
  for (let key in templateObject) {
    
    const value = templateObject[key];
    if (VERBOSE) console.log('Processing key', key, 'value', value);
    
    if (typeof value === 'string') {
      
      // render can throw, but this function does not handle errors
      const renderResult = render(value, context);
      
      if (VERBOSE) console.log('-->', renderResult);
      
      // When unable to process a velocity string, render returns the string.
      // This typically happens when it looks for a value and gets a JS typeerror
      // Also, typeof renderResult === 'string' so, yes: 'undefined' string.
      
      switch (renderResult) {
        case value:
        case 'undefined':
          result[key] = undefined;
          break;
          
        case 'null':
          result[key] = null;
          break;
          
        case 'true':
          result[key] = true;
          break;
          
        case 'false':
          result[key] = false;
          break;
          
        default:
          result[key] = renderResult;
          break;
      }
      
    } else if (isPlainObject(value)) {
      // Go deeper
      result[key] = renderVelocityTemplateObject(value, context);
      
    } else {
      // This should never happen: value should either be a string or a plain object
      result[key] = value;
    }
  }
  
  return result;
};
