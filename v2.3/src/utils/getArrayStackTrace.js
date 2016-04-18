'use strict';

module.exports = function getArrayStackTrace(stack) {
  if (!stack) return null;
  
  const splittedStack = stack.split('\n');
  
  // TODO:
  // return splittedStack.slice(0, splittedStack.findIndex(item => item.match(/server.route.handler.createLambdaContext/))).map(line => line.trim());
  return splittedStack;
};
