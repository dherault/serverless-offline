'use strict';
var Compile = require('./compile/');
var Helper = require('./helper/index');
var parse = require('./parse');

Compile.parse = parse;

var Velocity = {
  parse: parse,
  Compile: Compile,
  Helper: Helper
};

Velocity.render = function(template, context, macros) {

  var asts = parse(template);
  var compile = new Compile(asts);
  return compile.render(context, macros);
};

module.exports = Velocity;
