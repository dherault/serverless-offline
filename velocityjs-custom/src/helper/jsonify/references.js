module.exports = function(Velocity, utils){

  utils.mixin(Velocity.prototype, {

    //获取变量类型
    //TODO: foreach嵌套处理
    getRefType: function(ast){

      var local = this.getLocal(ast);
      var real = local.real || ast;
      var ret = { ignore: false, type: 'string', real: real, foreach: false };

      if (local.real === undefined && local.isGlobal !== true) {
        ret.ignore = true;
      }

      var m = this.hasMethod(real);
      var eachTo;

      if (local.type == 'foreach') {

        if (ast.id == local.ast.to) {

          // 排除get key value size等通用方法
          if (ast.path && !(~['get', 'key', 'value', 'size'].indexOf(ast.path[0].id))) {
            local.objectKeys.push(ast.path[0].id);
            ret.ignore = true;
          } else {
            ret.real = local.ast;
            ret.foreach = true;
          }
        }

        eachTo = ast.id;
      }

      if (m === 'ignore') {
        ret.ignore = true;
      } else if (m) {
        ret.foreach = ret.foreach || this.hasParamInForeach(real);
        ret.type = 'method';
      }

      return ret;

    },

    hasParamInForeach: function(ast){

      var args = ast.args;
      var ret = false;

      if (args === undefined && ast.path) {
        args = ast.path[ast.path.length - 1].args;
      }

      if (args) {

        utils.some(args, function(a){
          var local = this.getLocal(a);
          if (local.type === 'foreach') {
            ret = local.ast; 
            return true;
          }
        }, this);

      }

      return ret;
    },

    /**
     * @param ast references ast
     * @return {true|false|'ignore'} true:pass, false:no method, ignore:ignore
     */
    hasMethod: function(ast){

      var ret = false;

      ret = ast.args !== undefined;

      var path = ast.path;

      if (path) {
        var len = path.length;
        var methods = utils.filter(path, function(a){
          var isGet = a.id.indexOf('get') === 0 && a.args === false;
          return a.type === 'method' && !isGet;
        });
        var _len = methods.length;

        //连缀方式$f.foo().bar()或者函数在中间的情况$foo().bar，跳过
        if (ret || _len > 1 || 
          (_len === 1 && path[len - 1].type !== 'method')) {
          ret = 'ignore';
        } else if (ret === false && _len === 1) {
          ret = true;
        }
      }

      return ret;

    },

    isFn: function(ast){
      var fns = this.fns.context;
      var isNoPass = true;
      fns = fns[ast.id];

      if (fns) {
        var args = null;
        var fn;
        utils.forEach(ast.path, function(a){

          if (typeof fn !== 'function') {
            fn = fns[a.id];
          } else {
            return;
          }

          if (a.type === 'method') {
            if (typeof fn === 'function') {
              args = a.args;
              isNoPass = false;
            }
          } else {
            fns = fns[a.id];
          }

        });

        var _arg = [];
        utils.forEach(args, function(arg){
          _arg.push(arg.value);
        });

        fn && fn.apply && fn.apply(this, _arg);
      }

      return !isNoPass;
    },

    getReferences: function(ast){

      if (ast.type !== 'references') return;

      if (this.isFn(ast)) {

      } else {

        var astType = this.getRefType(ast);

        var real = astType.real;
        var text = real.from ? this.getRefText(real.from): this.getRefText(real);

        //执行过一遍，不再执行
        if (this.cache[text]) return;

        this.toBasicType(astType);

        this.cache[text] = true;
      }

    },

    getLocal: function(ref){

      var ret = { context: this.context, isGlobal: true };

      utils.some(this.conditions, function(content){

        var local = this.local[content];
        var index = local.variable.indexOf(ref.id);

        if (index > -1) {
          ret = local;
          ret['isGlobal'] = false;
          ret['real'] = ret.maps? ret.maps[index]: ref;
          if (ret['real'] && ret['real'].type !== 'references') {
            ret['real'] = undefined;
          }
          return true;
        }

      }, this);

      if (ret.type === 'macro' && ret.real && !this.context[ref.id]) {
        // see: https://github.com/shepherdwind/velocity.js/issues/13
        // 最后一个判断，防止死循环
        // 递归查找上层
        var _local  = this.getLocal(ret.real);
        if (_local.isGlobal === false && _local.real) {
          ret.real = _local.real;
        }
      }

      return ret;
    }
  });
};
