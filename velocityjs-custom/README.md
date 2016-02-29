This is a modified version of the module.
The only difference is in src/compile/index.js
I set `escape` to `false`

Velocity - Template Engine
==========================
[![Build Status](https://travis-ci.org/shepherdwind/velocity.js.svg?branch=master)](https://travis-ci.org/shepherdwind/velocity.js)
[![Coverage Status](https://img.shields.io/coveralls/shepherdwind/velocity.js/master.svg?style=flat)](https://coveralls.io/r/shepherdwind/velocity.js)

[![NPM](https://nodei.co/npm/velocityjs.png?downloads=true)](https://nodei.co/npm/velocityjs/)

velocity.js是[velocity](http://velocity.apache.org/)模板语法的javascript实现。

##Features

- 支持客户端和服务器端使用
- 语法分析和模板渲染分离
- 基本完全支持velocity[语法](http://velocity.apache.org/engine/devel/user-guide.html)
- [Vim Syntax](https://github.com/shepherdwind/vim-velocity)

##Install

via npm:

```bash
$ npm install velocityjs
```

##Broswer

兼容支持es5的浏览器，可以通过测试来验证[test case](http://git.shepherdwind.com/velocity.js/runner/tests.html)。

对于低端浏览器需要实现以下方法

1. Array.prototype的map, forEach, some, filter, every, indexOf
2. Date.now
3. Object.keys

##Examples

在tests目录下有大量的例子，node和浏览器下使用是一致的，另外，examples目录下有一个
最简单的例子。

##Public API

文件组织通过CommonJS方式，对于浏览器，通过spm可以打包为cmd模块。

```js
var Velocity = require('velocityjs');

//1. 直接解析
Velocity.render('string of velocity', context, macros);

//2. 使用parse和Compile
var Compile = Velocity.Compile;

var asts = Velocity.parse('string of velocity');
(new Compile(asts)).render(context, macros);
```

####context

`context`是一个对象，可以为空，执行中`$foo.bar`，访问路径是`context.foo.bar`，
`context`的属性可以是函数，和vm中定义保持一致。

context中得函数，有一个固定的`eval`方法，可以用来运算vm语法字符串，比如webx对应的
`$control.setTemplate`的[实现](https://github.com/shepherdwind/velocity.js/blob/master/tests/compile.js#L532)。

##Syntax

具体语法请访问官网文档：[velocity user guide](http://velocity.apache.org/engine/devel/user-guide.html)。

###Directives

Directives支持`set`, `foreach`, `if|else|elseif`, `macro`, `break`。不
支持有，`stop`, `evaluate`, `define`, `parse`。不过可以通过context来实现，比如
`parse` [实现](https://github.com/shepherdwind/velocity.js/blob/master/tests/compile.js#L458)。

###macro与parse

宏分为系统的宏，比如`parse, include`，和用户自定义宏，通过`#macro`在vm中定义，此
外可以使用自定义的js函数替代在vm中定义。对于系统宏和自定义宏，不做区分，对于
`#parse`和`#include`的调用，可以使用自定义函数来执行，可以参考测试用例中self defined macro部分。

##Questions

提问有几种方式

1. 新建[issue](https://github.com/shepherdwind/velocity.js/issues/new)
2. 邮件到eward.song at gmail.com
3. 阿里内部员工，可以通过hanwen.sah搜到我的旺旺

## 其他

推荐一下沉鱼写的[velocity](https://github.com/fool2fish/velocity)。

##License

(The MIT License)
