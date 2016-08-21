'use strict';

module.exports = (oldEnvVars, newEnvVars) => {
  // Clears old vars
  for (let key in oldEnvVars) { // eslint-disable-line prefer-const
    delete process.env[key];
  }

  // Declares new ones
  for (let key in newEnvVars) { // eslint-disable-line prefer-const
    process.env[key] = newEnvVars[key];
  }
};

