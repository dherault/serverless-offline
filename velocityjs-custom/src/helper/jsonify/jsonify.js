var Parser = require('../../parse/index');
var Compile = require('../../compile/index');
var fs = require('fs');
var macros = Parser.parse(fs.readFileSync(__dirname + '/macros.vm').toString());

function getVmText(macro, vmText, third){
  var vm = new Compile(macros);
  return vm.render({
    macro: macro,
    vmText: vmText,
    third: third
  });
}

module.exports = function(Velocity, utils, BLOCK_TYPES){

  function getPath(ast){

    var ret = [ast.id];

    utils.forEach(ast.path, function(a){

      var isIgnore = a.type === 'method' && a.id === 'size'; 
      var isGet = a.type === 'method' && a.id.indexOf('get') === 0 && a.args === false;
      if (isIgnore) {
        return;
      }

      if (a.type === 'index') {
        if (a.id && (a.id.type === 'integer' || a.id.type === 'string')) 
          ret.push(a.id.value);
      } else {
        ret.push(isGet ? a.id.slice(3) : a.id);
      }

    });

    return ret;
  }

  utils.mixin(Velocity.prototype, {

    toBasicType: function(astType){

      if (astType.ignore) return;

      var ast = astType.real;
      if (ast.type === 'foreach') ast = ast.from;

      if (astType.foreach === true && astType.type === 'method') {
        var isMaps = true;
      }

      this.setRef(ast, this.getLeaf(astType), isMaps);

    },

    setRef: function(ast, text, isMaps){

      var paths = getPath(ast);
      var last  = paths.pop();
      var context = this.context;
      var leafs = this.leafs;
      var len   = leafs.length;

      if (isMaps && (last === 'entrySet' || last === 'keySet')) 
        last = paths.pop();

      utils.forEach(paths, function(path){

        if (!context[path] || typeof context[path] === "string") {
          context[path] = {};
        }

        context = context[path];

      }, this);

      leafs.push(text);
      context[last] = '{@' + len + '@}';
    },

    toVTL: function(){
      var leafs = this.leafs;
      var context = JSON.stringify(this.context, false, 2);

      utils.forEach(leafs, function(leaf, i){
        var tpl = '"{@' + i + '@}"';
        context = context.replace(tpl, leaf);
      }, this);

      return context;
    },

    getLeaf: function(leaf){
      var ret = '';
      var real = leaf.real;

      if (!leaf.foreach) {
        if (leaf.type === 'method') {
          ret = this.getMethodCall(leaf);
        } else {
          ret = this._callMacro('string', this.getRefText(real));
        }
      } else {
        if (leaf.foreach === true && real.from) {
          ret = this.getEachVTL(leaf);
        } else {
          ret = this.getMethodInEachCall(leaf);
        }
      }

      return ret;
    },

    getMethodInEachCall: function(leaf){
      return '"function(){}"';
    },

    getMethodCall: function(leaf){
      return '"function(){}"';
/*
 *      var ast = leaf.real;
 *      var paths = getPath(ast);
 *      var len = ast.path.length;
 *      var last = ast.path[len - 1];
 *      var args = last.args;
 *
 *      var argText = [];
 *      utils.forEach(args, function(arg){
 *        argText.push('"' + this.getRefText(arg) + '"');
 *      }, this);
 *      argText = argText.join(', ');
 *
 *      var retText = this.getRefText(ast);
 *
 *      //console.log(getVmText('method', argText, retText));
 *      return getVmText('method', argText, retText);
 */
    },

    _callMacro: getVmText,

    getEachVTL: function(leaf){
      var real = leaf.real;
      var paths = getPath(real.from);
      var last  = paths.pop();
      var macro = 'lists';
      var vmText = this.getRefText(real.from);

      if (leaf.type === 'method' && last === 'entrySet') {
        macro = 'maps';
        vmText = vmText.replace(/\.entrySet\(\)$/, '');
      } else if (leaf.type === 'method' && last === 'keySet') {
        macro = 'maps';
        vmText = vmText.replace(/\.keySet\(\)$/, '');
      }

      return this._callMacro(macro, vmText);
    },

    eval: function(str){
      if (str) {
        var asts = Parser.parse(str);
        if (this instanceof Velocity){
          this._render(asts);
        } else {
          throw new Error('不能改变this指向');
        }
      }
    }

  });

};
