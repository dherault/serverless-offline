
%x mu c i h esc run

%%

[^#]*?/"$"                        {
                                    var _reg = /\\+$/;
                                    var _esc = yytext.match(_reg);
                                    var _num = _esc ? _esc[0].length: null;
                                    /*转义实现，非常恶心，暂时没有好的解决方案*/
                                    if (!_num || !(_num % 2)) {
                                      this.begin("mu");
                                    } else {
                                      yytext = yytext.replace(/\\$/, '');
                                      this.begin('esc');
                                    }
                                    if (_num > 1) yytext = yytext.replace(/(\\\\)+$/, '\\');
                                    if(yytext) return 'CONTENT'; 
                                  }

[^\$]*?/"#"                       { 
                                    var _reg = /\\+$/;
                                    var _esc = yytext.match(_reg);
                                    var _num = _esc ? _esc[0].length: null;
                                    if (!_num || !(_num % 2)) {
                                      this.begin("h");
                                    } else {
                                      yytext = yytext.replace(/\\$/, '');
                                      this.begin('esc');
                                    }
                                    if (_num > 1) yytext = yytext.replace(/(\\\\)+$/, '\\');
                                    if(yytext) return 'CONTENT'; 
                                  }

[^\x00]+                          { return 'CONTENT'; }
<h>"#"\*[\s\S]+?\*"#"             { this.popState(); return 'COMMENT'; }
<h>"#"\[\[[\s\S]+?\]\]"#"         { this.popState(); yytext = yytext.replace(/^#\[\[|\]\]#$/g, ''); return 'RAW'}
<h,mu>"##"[^\n]+                  { this.popState(); return 'COMMENT'; }
<h>"#"/[a-zA-Z{]                  { return 'HASH'; }
<h>"set"[ ]*/[^a-zA-Z0-9_]+       { return 'SET'; }
<h>"if"[ ]*/[^a-zA-Z0-9_]+        { return 'IF'; }
<h>"elseif"[ ]*/[^a-zA-Z0-9_]+    { return 'ELSEIF'; }
<h>"else"                         { this.popState(); return 'ELSE'; }
<h>"{else}"                       { this.popState(); return 'ELSE'; }
<h>"end"                          { this.popState(); return 'END'; }
<h>"break"                        { this.popState(); return 'BREAK'; }
<h>"foreach"[ ]*/[^a-zA-Z0-9_]+   { return 'FOREACH'; }
<h>"noescape"/[^a-zA-Z0-9_]+      { return 'NOESCAPE'; }
<h>"define"[ ]*/[^a-zA-Z0-9_]+    { return 'DEFINE'; }
<h>"macro"[ ]*/[^a-zA-Z0-9_]+     { return 'MACRO'; }
<c,i>"in"                         { return 'IN'; }
<c,i>[%\+\-\*/]                   { return yytext; }
<c,i>"<="                         { return yytext; }
<c,i>">="                         { return yytext; }
<c,i>[><]                         { return yytext; }
<c,i>"=="                         { return yytext; }
<c,i>"||"                         { return yytext; }
<c,i>"&&"                         { return yytext; }
<c,i>"!="                         { return yytext; }
<mu,c,run,h,i>"$!"/[{a-zA-Z_]     { return 'DOLLAR'; }
<mu,run,h,c,i>"$"/[{a-zA-Z_]      { return 'DOLLAR'; }
<h,run,c,i>"!"                    { return yytext; }
<h,c,i>"="                        { return 'EQUAL'; }
<run,c>[ ]+/[^,]                  {
                                    var len = this.stateStackSize();
                                    if (len >= 2 && this.topState() === 'c' && this.topState(1) === 'run') {
                                      return 'SPACE';
                                    }
                                  }
<c,run,i>\s+                      { /*ignore whitespace*/ }
<i,run,c,i>"{"                         { return 'MAP_BEGIN'; }
<i,run,c,i>"}"                         { return 'MAP_END'; }
<h,run,c,i>":"[\s]*                    { return 'MAP_SPLIT'; }
<mu>"{"                              { yy.begin = true; return 'VAR_BEGIN'; }
<mu>"}"                              { this.popState(); if (yy.begin === true) { yy.begin = false; return 'VAR_END';} else { return 'CONTENT'; } }
<mu,h,run,c,i>"("[\s]*/[$'"\[\{\-0-9\w()!] { this.begin("c"); return 'PARENTHESIS'; }
<mu,h,run,c,i>")"                 {
                                    if (this.popState() === "c") {
                                      var len = this.stateStackSize();

                                      if (this.topState() === 'run') {
                                        this.popState();
                                        len = len - 1;
                                      }

                                      var tailStack = this.topState(len - 2);
                                      /** 遇到#set(a = b)括号结束后结束状态h*/
                                      if (len === 2 && tailStack === "h"){
                                        this.popState();
                                      } else if (len === 3 && tailStack === "mu" &&  this.topState(len - 3) === "h") {
                                        // issue#7 $foo#if($a)...#end
                                        this.popState();
                                        this.popState();
                                      }

                                      return 'CLOSE_PARENTHESIS'; 
                                    } else {
                                      return 'CONTENT'; 
                                    }
                                  }
<mu,h,run,c,i>"["[\s]*/[\-$"'0-9{\[\]]+     { this.begin("i"); return 'BRACKET'; }
<mu,h,run,c,i>"]"                 { 
                                    if (this.popState() === "i") {
                                      return 'CLOSE_BRACKET'; 
                                    } else {
                                      return 'CONTENT';
                                    }
                                  }

<i>".."                              { return 'RANGE'; }
<mu,h,run,c,i>"."/[a-zA-Z_]          { return 'DOT'; }
<run,c,i>"."/[\d]               { return 'DECIMAL_POINT'; }
<run,c,i>","[ ]*                     { return 'COMMA'; }
<run,c,i>'"'(\\\"|[^\"])*'"'         { yytext = yytext.substr(1, yyleng-2).replace(/\\"/g,'"'); return 'EVAL_STRING'; }
<run,c,i>"'"(\\\'|[^\'])*"'"         { yytext = yytext.substr(1, yyleng-2).replace(/\\'/g,"'"); return 'STRING'; }
<run,c,i>"null"                      { return 'BOOL'; }
<run,c,i>"false"                     { return 'BOOL'; }
<run,c,i>"true"                      { return 'BOOL'; }
<h,run,c,i>[0-9]+                    { return 'INTEGER'; }
<mu,run,c,i>[_a-zA-Z][a-zA-Z0-9_\-]* { return 'ID'; }
<h>[_a-zA-Z][a-zA-Z0-9_\-]*[ ]*/"("  { this.begin("run"); return 'ID'; }
<mu>"#"                              { this.begin('h'); return 'HASH'; }
<h,run,mu>.                          { this.popState(); return 'CONTENT'; }
<h,run,mu>\s+                        { this.popState(); return 'CONTENT'; }
<esc>[\$#]                           { this.popState(); return 'CONTENT'; }
<mu,h,run><<EOF>>                    { this.popState(); return 'EOF'; }
<INITIAL><<EOF>>                     { return 'EOF'; }
