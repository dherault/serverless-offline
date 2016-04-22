'use strict';

_registerBabel(isBabelRuntime, babelRuntimeOptions) {
      
      // Babel options can vary from handler to handler just like env vars
      const options = isBabelRuntime ? 
        babelRuntimeOptions || { presets: ['es2015'] } :
        this.globalBabelOptions;
      
      if (options) {
        logDebug('Setting babel register:', options);
        
        // We invoke babel-register only once
        if (!this.babelRegister) {
          logDebug('For the first time');
          this.babelRegister = require('babel-register');
        }
        
        // But re-set the options at each handler invocation
        this.babelRegister(options);
      }
    }