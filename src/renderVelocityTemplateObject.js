'use strict';

const Velocity = require('velocityjs');
const isPlainObject = require('lodash.isplainobject');

const Compile = Velocity.Compile;
const parse = Velocity.parse;
const verbose = process.argv.indexOf('--debugOffline') !== -1;

/* 
This function deeply traverses a plain object's keys (the serverless template, previously JSON)
When it finds a string, assumes it's Velocity language and renders it.
*/
module.exports = function renderVelocityTemplateObject(templateObject, context) {
  
  const result = {};
  let toProcess = templateObject;
  
  // In some projects, the template object is a string, let us see if it's JSON
  if (typeof toProcess === 'string') toProcess = tryToParseJSON(toProcess);
  
  // Let's check again
  if (isPlainObject(toProcess)) {
    for (let key in toProcess) {
      
      const value = toProcess[key];
      if (verbose) console.log('Processing key', key, 'value', value);
      
      if (typeof value === 'string') result[key] = renderVelocityString(value, context);
      
      // Go deeper
      else if (isPlainObject(value)) result[key] = renderVelocityTemplateObject(value, context);
        
      // This should never happen: value should either be a string or a plain object
      else result[key] = value;
    }
  }
  
  // Still a string? Maybe it's some complex Velocity stuff
  else if (typeof toProcess === 'string') {
    
    // If the plugin threw here then you should consider reviewing your template or posting an issue.
    const alternativeResult = tryToParseJSON(renderVelocityString(toProcess));
    
    return isPlainObject(alternativeResult) ? alternativeResult : result;
  }
  
  return result;
};

function renderVelocityString(velocityString, context) {
  
  // This line can throw, but this function does not handle errors
  const renderResult = (new Compile(parse(velocityString), { escape: false })).render(context);
  
  if (verbose) console.log('-->', renderResult);
  
  // When unable to process a velocity string, render returns the string.
  // This typically happens when it looks for a value and gets a JS typeerror
  // Also, typeof renderResult === 'string' so, yes: 'undefined' string.
  
  switch (renderResult) {
    
    case velocityString:
    case 'undefined':
      return undefined;
      
    case 'null':
      return null;
      
    case 'true':
      return true;
      
    case 'false':
      return false;
      
    default:
      return tryToParseJSON(renderResult);
  }
}

function tryToParseJSON(string) {
  let parsed;
  try {
    parsed = JSON.parse(string);
  }
  catch (err) {
    // nothing! Some things are not meant to be parsed.
  }
  finally {
    return parsed || string;
  }
}
