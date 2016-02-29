var utils = require('../../utils');
var Helper = require('../index');

function Jsonify(){
  this.init.apply(this, arguments);
}

var TRIM = /[\t\n\r]+/g;
var BLOCK_TYPES = ['if', 'foreach', 'macro', 'noescape'];

Jsonify.prototype = {

  constructor: Jsonify,

  init: function(asts, context, macros){

    this.fns = {
      context: context || {},
      macros: macros || {}
    };

    this.context = {};
    this.leafs   = [];

    this.asts       = asts;
    this.local      = {};
    this.macros     = {};
    this.conditions = [];
    this.cache      = {};

    this._render(this.asts);
  },

  getRefText: Helper.getRefText,

  _render: function(asts){

    var block = [];
    var index = 0;

    utils.forEach(asts, function(ast){
      var type = ast.type;

      //foreach if macro时，index加一
      if (BLOCK_TYPES.indexOf(type) > -1) index ++;

      if (type === 'comment') return;

      if (index) {
        type === 'end' && index--;
        if (index) {
          block.push(ast);
          return;
        }
      }

      switch(type) {
        case 'references':
        this.getReferences(ast);
        break;

        case 'set':
        break;

        case 'macro_call':
        this.getMacro(ast);
        break;

        case 'end':
        //使用slice获取block的拷贝
        this.getBlock(block.slice());
        block = [];
        break;

        default:
        if (utils.isArray(ast)) this.getBlock(ast);
        break;

      }
    }, this);

  }

};

require('./references')(Jsonify, utils);
require('./jsonify')(Jsonify, utils);
require('./block')(Jsonify, utils, BLOCK_TYPES);
require('../../compile/expression')(Jsonify, utils);
require('../../compile/literal')(Jsonify, utils);
require('../../compile/set')(Jsonify, utils);

module.exports = Jsonify;
