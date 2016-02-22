/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	var Parser = require('$system/parse/onejsparser')

	exports.walk = function(ast, textbuf, add){
		var glwalker = new this()
		glwalker.line = 0
		glwalker.textbuf = textbuf
		glwalker.add = add
		glwalker.expand(ast)
	}

	this.post_comma = 1
	this.post_colon = 1
	this.around_operator = 1
	this.actual_indent = 0
	this.actual_line = 0

	this.atConstructor = function(){
		this.indent = 0
	}

	// helper functions
	this.dColon = function(type, padding){
		this.add('::', padding, type, exports._DColon)
	}

	this.dot = function(type, padding){
		this.add('.', padding, type, exports._Dot)
	}

	this.colon = function(type, padding){
		this.add(':', padding, type, exports._Colon)
	}

	this.semiColon = function(type, padding){
		this.add(';', padding, type, exports._SemiColon)
	}

	this.comma = function(type, padding){
		this.add(',', padding, type, exports._Comma)
	}

	this.parenL = function(type, padding){
		this.add('(', padding, type, exports._Paren, exports._ParenL)
	}

	this.parenR = function(type, padding){
		this.add(')', padding, type, exports._Paren, exports._ParenL)
	}

	this.braceL = function(type, padding){
		this.add('{', padding, type, exports._Brace, exports._BraceL)
	}

	this.braceR = function(type, padding){
		this.add('}', padding, type, exports._Brace, exports._BraceR)
	}

	this.bracketL = function(type, padding){
		this.add('[', padding, type, exports._Bracket, exports._BracketL)
	}

	this.bracketR = function(type, padding){
		this.add(']', padding, type, exports._Bracket, exports._BracketR)
	}

	this.operator = function(op, type, padding){
		this.add(op, padding, type, exports._Operator, exports.ops[op])
	}

	this.keyword = function(value, type, padding){
		this.add(value, padding || 0, type, exports._Keyword)
	}

	this.tab = function(indent){
		// lets add a tab
		this.actual_indent = indent
		this.add('\t', 4*256 + indent)
		//this.add(Array(indent+1).join('\t') )
	}

	this.space = function(){
		this.add(' ')
	}


	this.newline = function(){
		this.actual_line++
		this.add('\n')
	}

	this.comment = function(text, pre){
		if(this.lastIsNewline()) this.tab(this.indent), pre = ''
		this.add((pre||'') + '//' + text, 0, exports._Comment)
	}

	this.comments = function(comments, prefix){
		var has_newline = false
		if(!comments) return false
		for(var i = 0; i < comments.length; i++){
			var comment = comments[i]
			if(comment === 1){
				if(this.lastIsNewline()) this.tab(this.indent)
				this.newline()
				has_newline = true
			}
			else this.comment(comment, prefix)
		}
		return has_newline
	}

	this.lastIsNewline = function(){
		return this.textbuf.charCodeAt(this.textbuf.char_count - 1) === 10
	}

	this.lastCharCode = function(){
		return this.textbuf.charCodeAt(this.textbuf.char_count - 1)
	}

	// expand ast node
	this.expand = function(n, arg){
		if(n){
			if(!this[n.type]) throw new Error('type '+n.type+' not in codeview')
			else return this[n.type](n, arg)
		}
	}

	// AST nodes
	this.Program = function(n){
		this.Block(n, true)
	}

	this.Empty = function(n){}

	this.Id = function(n){
		this.add(n.name, 0, exports._Id)
	}

	this.Property = function(n, secondary){
		this.add(n.name, 0, exports._Property, secondary ||0)
	}

	this.Value = function(n){//: { value:0, raw:0, kind:0, multi:0 },
		if(n.kind === undefined){
			var str
			if(typeof n.value === 'string'){
				if(n.value.indexOf('"')!==-1) str = "'" + n.value + "'"
				else str = '"' + n.value + '"'
			}
			else str = '' + n.value
			this.add(str, 0, exports._Value, exports._Number)
		}
		else if(n.kind == 'num')
			this.add(n.raw!==undefined?n.raw:''+n.value, 0, exports._Value, exports._Number)
		else if(n.kind == 'string')
			this.add(n.raw!==undefined?n.raw:'"'+n.value+'"', 0, exports._Value, exports._String)
		else
			this.add(n.raw!==undefined?n.raw:''+n.value, 0, exports._Value)
	}

	this.This = function(n){//: { },
		this.add('this', 0, exports._This, exports._Keyword)
	}

	this.Array = function(n){//: { elems:2 },
		this.bracketL(exports._Array, 0)

		var has_newlines = false
		if(this.comments(n.cm1)) has_newlines = true
		var old_indent = this.indent
		if(has_newlines) this.indent++

		for(var i = 0; i < n.elems.length; i++){
			var elem = n.elems[i]
			if(!elem) continue
			//if(!has_newlines && i) this.comma(exports._Array, 0)
			this.comments(elem.cmu)
			if(this.lastIsNewline()) this.tab(this.indent)
			this.expand(elem)
			if(i < n.elems.length - 1) this.comma(exports._Array, 2*256+this.post_comma)
			if(has_newlines && !this.comments(elem.cmr))
				this.newline()
		}
		if(has_newlines && this.comments(n.cm2)) this.tab(this.indent - 1)

		if(this.lastIsNewline()) this.tab(old_indent)

		this.indent = old_indent
		this.bracketR(exports._Array, 0)
		return has_newlines
	}

	this.Object = function(n, indent){//: { keys:3 },
		this.braceL(exports._Object, 0)
		// allright so
		var has_newlines = false

		if(this.comments(n.cm1)) has_newlines = true

		//console.log(has_newlines, n)

		var old_indent = this.indent
		if(has_newlines)
			this.indent++

		for(var i = 0; i < n.keys.length; i ++){
			var prop = n.keys[i]
			//if(!has_newlines && i){
			//	this.comma(exports._Object, 0)
			//	this.space()
			//}
			if(this.lastIsNewline()) this.tab(this.indent)
			if(has_newlines) this.comments(prop.cmu)
			if(this.lastIsNewline()) this.tab(this.indent)

			this.expand(prop.key, exports._Object)
			if(prop.value){
				this.colon(exports._Object)
				this.expand(prop.value)
			}
			if(i < n.keys.length - 1){
				this.comma(exports._Object, 2*256+this.post_comma)
				//this.space()
			}
			if(has_newlines && !this.comments(prop.cmr)){
				this.newline()
			}
		}
		if(has_newlines){
		 	//this.comments(n.cm2)
		 	// check if we are in an argument list
			if(this.lastIsNewline()) this.tab(indent?old_indent+1:old_indent)
		}
		this.indent = old_indent
		this.braceR(exports._Object, 0)

		return has_newlines
	}

	this.Index = function(n){//: { object:1, index:1 },
		this.expand(n.object)
		this.bracketL(exports._Index, 0)
		if(n.index) this.expand(n.index)
		this.bracketR(exports._Index, 0)
	}

	this.Key = function(n){//: { object:1, key:1, exist:0 },
		this.expand(n.object)
		if(n.cm1 && this.comments(n.cm1,' ')){
			this.tab(this.indent + 1)
		}
		this.dot(exports._Key)
		if(n.cm2 && this.comments(n.cm2,' ')){
			this.tab(this.indent + 1)
		}
		this.expand(n.key)
	}

	this.Block = function(n, skipbrace){//:{ steps:2 },
		var old_indent = 0

		if(!skipbrace){
			this.braceL(exports._Block, 0)
			old_indent = this.indent
			this.indent++
			// lets output our immediate follow comments
		}

		this.comments(n.cm1, ' ')
		if(!skipbrace){
			if(!this.lastIsNewline()) this.newline()
		}

		for(var i = 0; i < n.steps.length; i++){
			var step = n.steps[i]
			// if we have comments above, insert them
			this.comments(step.cmu)
			if(this.lastIsNewline()) this.tab(this.indent)


			this.expand(step)
			this.comments(step.cmr, ' ')
			if(!this.lastIsNewline()) this.newline()
		}
		this.comments(n.cm2)
		if(!skipbrace){
			// lets add our tail comments
			this.indent = old_indent
			if(!this.lastIsNewline()){
				this.newline()
			}
			this.tab(old_indent)
			this.braceR(exports._Block, 0)
		}
	}

	this.List = function(n){//: { items:2 },
		for(var i = 0; i < n.items.length; i++){
			var item = n.items[i]
			if(i) this.comma(exports._List)
			this.expand(item)
		}
	}

	this.Break = function(n){//: { label:1 },
		this.keyword('break', exports._Break)
	}

	this.Continue = function(n){//: { label:1 },
		this.keyword('continue', exports._Continue)
	}

	this.Label = function(n){//: { label:1, body:1 },
		this.expand(n.label)
		this.expand(n.body)
	}

	this.If = function(n){//: { test:1, then:1, else:1, postfix:0, compr:0 },
		this.keyword('if', exports._If)
		//this.space()
		this.parenL(exports._If, 0)
		this.indent++
		this.expand(n.test)
		this.indent--
		this.parenR(exports._If, 0)
		//this.space()
		// if our n.then has wsu, lets do it
		if(n.then.cmu){
			if(this.comments(n.then.cmu)) this.tab(this.indent+1)
		}
		this.expand(n.then)
		if(n.else){
			// we have to end the if expression properly
			if(!this.comments(n.cm1,' ')) this.newline()

			if(this.lastIsNewline()) this.tab(this.indent)

			this.keyword('else', exports._If)
			//this.space()
			if(n.else.cmu){
				if(this.comments(n.else.cmu)) this.tab(this.indent+1)
			}
			this.expand(n.else)
			//debug()
		}
	}

	this.Switch = function(n){//: { on:1, cases:2 },
		this.keyword('switch', _Switch)
		//this.space()
		this.parenL(_Switch, 0)
		this.expand(n.on)
		this.parenR(_Switch, 0)
		//this.space()
		this.braceL(_Switch, 0)

		//var old_indent = indent
		//indent++

		if(!this.comments(n.cm1)){
			this.newline()
			this.tab(indent)
		}

		for(var i = 0; i < n.cases.length; i++){
			this.expand(n.cases[i])
		}
		this.comments(n.cm2)
		//indent = old_indent
		if(this.lastIsNewline()) this.tab(indent)
		this.braceR(exports._Switch, 0)
	}

	this.Case = function(n){//: { test:1, then:2 },
		this.comments(n.cmu)
		if(!this.lastIsNewline()) this.newline()
		this.tab(indent)
		this.keyword('case', exports._Case)
		//this.space()
		this.expand(n.test)
		this.colon(exports._Case)
		this.comments(n.cmr)

		if(n.steps && n.steps.length){
			if(!this.lastIsNewline()) this.newline()
			var old_indent = this.indent
			this.indent++
			this.tab(this.indent)
			this.Block(n, true)
			this.indent = old_indent
		}
		//expand(n.then)
	}

	this.Throw = function(n){//: { arg:1 },
		this.keyword('throw', exports._Throw)
		//this.space()
		this.expand(n.arg)
	}

	this.Try = function(n){//: { try:1, arg:1, catch:1, finally:1 },
		this.Keyword('try', exports._Try)
		this.expand(n.try)
		this.Keyword('catch', exports._Try)
		this.parenL(exports._Try, 0)
		this.expand(n.arg)
		this.parenR(exports._Try, 0)
		this.expand(n.catch)
		if(n.finally){
			this.keyword('finally', exports._Try)
			this.expand(n.finally)
		}
	}

	this.While = function(n){//: { test:1, loop:1 },
		this.keyword('while', exports._While)
		this.parenL(exports._While, 0)
		this.expand(n.test)
		this.parenR(exports._While, 0)
		this.expand(n.loop)
	}

	this.DoWhile = function(n){//: { loop:1, test:1 },
		this.keyword('do', exports._Do)
		this.expand(n.loop)
		this.keyword('while', exports._Do)
		this.parenL(exports._Do, 0)
		this.expand(n.test)
		this.parenR(exports._Do, 0)
	}

	this.For = function(n){//: { init:1, test:1, update:1, loop:1, compr:0 },
		this.keyword('for', exports._For)
		//this.space()
		this.parenL(exports._For, 0)
		this.expand(n.init)
		this.semiColon(exports._For)
		//this.space()
		this.expand(n.test)
		this.semiColon(exports._For)
		//this.space()
		this.expand(n.update)
		this.parenR(exports._For, 0)
		if(n.loop.cmu){
			if(this.comments(n.loop.cmu)) this.tab(this.indent + 1)
		}
		//else if(n.loop.type != 'Block') this.space()
		this.expand(n.loop)
	}

	this.ForIn = function(n){//: { left:1, right:1, loop:1, compr:0 },
		this.keyword('for', exports._For)
		//this.space()
		this.parenL(exports._For, 0)
		this.expand(n.left)
		//this.space()
		this.keyword('in', exports._For)
		//this.space()
		this.expand(n.right)
		this.parenR(exports._For, 0)
		if(n.loop.cmu){
			if(this.comments(n.loop.cmu)) this.tab(this.indent + 1)
		}
		//else if(n.loop.type != 'Block') this.space()

		this.expand(n.loop)
	}

	this.ForOf = function(n){//: { left:1, right:1, loop:1, compr:0 },
		this.keyword('for', exports._For)
		//this.space()
		this.parenL(exports._For, 0)
		this.expand(n.left)
		//this.space()
		this.keyword('of', exports._For)
		//this.space()
		this.expand(n.right)
		this.parenR(exports._For, 0)
		if(n.loop.cmu){
			if(this.comments(n.loop.cmu)) this.tab(this.indent + 1)
		}
		//else if(n.loop.type != 'Block') this.space()

		this.expand(n.loop)
	}

	this.Var = function(n){//: { defs:2, const:0 },
		this.keyword('var', exports._Var)
		if(n.defs && n.defs.length){
			this.space()
			for(var i = 0; i < n.defs.length; i++){
				if(i) this.comma(exports._Var, 2*256+this.after_comma)
				this.expand(n.defs[i])
			}
		}
	}

	this.Def = function(n){//: { id:1, init:1, dim:1 },
		this.expand(n.id)
		if(n.init){
			//this.space()
			this.operator('=', exports._Def, 3*256+1)
			//this.space()
			this.expand(n.init)
		}
	}

	this.Function = function(n){//: { id:1, name:1, params:2, rest:1, body:1, arrow:0, gen:0, def:0 },
		if(!n.arrow){
			if(n.name) this.expand(n.name)
			else if(n.id){
				this.keyword('function', exports._Function)
				this.space()
				this.expand(n.id)
			}
			else this.keyword('function', exports._Function)
		}

		//else Keyword('function', _Function)
		this.parenL(exports._Function, 0)

		if(n.params) for(var i = 0; i < n.params.length; i++){
			if(i){
				this.comma(exports._Function, 2*256+1)//, this.space()
			}

			this.expand(n.params[i])
		}

		if(n.rest){
			if(i) this.comma(exports._Function)//, this.space()
			this.expand(n.rest)
		}

		this.parenR(exports._Function, 0)
		if(n.arrow=='=>') this.operator('=>', exports._Function)
		//else this.space()
		this.expand(n.body)
	}

	this.Return = function(n){//: { arg:1 },
		this.keyword('return', exports._Return)
		if(n.arg) this.space(), this.expand(n.arg)
	}

	this.Yield = function(n){//: { arg:1 },
		this.keyword('yield', exports._Yield)
		if(n.arg) this.space(), this.expand(n.arg)
	}

	this.Await = function(n){//: { arg:1 },
		this.keyword('await', exports._Await)
		if(n.arg) this.space(), this.expand(n.arg)
	}

	this.Unary = function(n){//: { op:0, prefix:0, arg:1 },
		if(n.prefix){
			if(n.op.length!=1)
				this.keyword(n.op, exports._Unary), this.space()
			else
				this.operator(n.op, exports._Unary)
			this.expand(n.arg)
		}
		else{
			this.expand(n.arg)
			this.operator(n.op, exports._Unary)
		}
	}

	this.Binary = function(n){//: { op:0, prio:0, left:1, right:1 },
		var paren_l = Parser.needsParens(n, n.left, true)
		var paren_r = Parser.needsParens(n, n.right)
		if(paren_l) this.parenL(exports._Binary, 0)
		this.expand(n.left)
		if(paren_l) this.parenR(exports._Binary, 0)
		var old_indent = this.indent
		this.indent++
		if(n.cm1 && this.comments(n.cm1,' ')){
			this.tab(this.indent)
		}
		//else this.space()
		this.operator(n.op, exports._Binary, 3*256+this.around_operator)

		if(n.cm2 && this.comments(n.cm2,' ')){
			this.tab(this.indent)
		}
		//else this.space()
		if(paren_r) this.parenL(exports._Binary, 0)
		this.expand(n.right)
		if(paren_r) this.parenR(exports._Binary, 0)
		this.indent = old_indent
	}

	this.Logic = function(n){//: { op:0, prio:0, left:1, right:1 },
		var paren_l = Parser.needsParens(n, n.left, true)
		var paren_r = Parser.needsParens(n, n.right)
		if(paren_l) this.parenL(exports._Logic, 0)
		this.expand(n.left)
		if(paren_l) this.parenR(exports._Logic, 0)
		var old_indent = this.indent
		this.indent++
		if(n.cm1 && this.comments(n.cm1,' ')){
			this.tab(this.indent)
		}
		//else this.space()
		if(n.op.length > 1){
			if(n.op.length == 2){
				this.operator(n.op[0], exports._Logic, 1*256+this.around_operator)
				this.operator(n.op[1], exports._Logic, 2*256+this.around_operator)
			}
			else{
				this.operator(n.op, exports._Logic,0)
			}
		}
		else{
			this.operator(n.op, exports._Logic, 3*256+this.around_operator)
		}

		if(n.cm2 && this.comments(n.cm2,' ')){
			this.tab(this.indent)
		}
		//else this.space()
		if(paren_r) this.parenL(exports._Logic,0)
		this.expand(n.right)
		if(paren_r) this.parenR(exports._Logic,0)
		this.indent = old_indent
	}

	this.Assign = function(n){//: { op:0, prio:0, left:1, right:1 },
		this.expand(n.left)
		var old_indent = this.indent
		this.indent++
		if(n.cm1 && this.comments(n.cm1,' ')){
			this.tab(this.indent)
		}
		//else this.space()
		//this.operator(n.op, exports._Assign, 0)
		if(n.op.length > 1){
			if(n.op.length == 2){
				this.operator(n.op[0], exports._Assign, 1*256+this.around_operator)
				this.operator(n.op[1], exports._Assign, 2*256+this.around_operator)
			}
			else{
				this.operator(n.op, exports._Assign,0)
			}
		}
		else{
			this.operator(n.op, exports._Assign, 3*256+this.around_operator)
		}


		if(n.cm2 && this.comments(n.cm2,' ')){
			this.tab(this.indent)
		}
		//else this.space()
		if(n.right.type === 'Function' || n.right.type === 'Object'){
			this.indent--
		}

		this.expand(n.right)
		this.indent = old_indent
	}

	this.Update = function(n){//: { op:0, prio:0, arg:1, prefix:0 },
		if(n.prefix){
			this.operator(n.op, exports._Update), this.expand(n.arg)
		}
		else{
			this.expand(n.arg)
			this.operator(n.op, exports._Update)
		}
	}

	this.Condition = function(n){//: { test:1, then:1, else:1 },
		this.expand(n.test)
		this.operator('?', exports._Condition)
		this.expand(n.then)
		this.operator(':', exports._Condition)
		this.expand(n.else)
	}

	this.New = function(n){//: { fn:1, args:2 },
		this.keyword('new', exports._New)
		this.space()
		this.expand(n.fn)
		this.parenL(exports._New)
		for(var i = 0; i < n.args.length; i++){
			if(i) this.comma(exports._New)//, this.space()
			this.expand(n.args[i])
		}
		this.parenR(exports._New)
	}

	this.Call = function(n){//: { fn:1, args:2 },
		var fn_t = n.fn.type
		if(fn_t == 'Function' || fn_t == 'List' || fn_t == 'Logic' || fn_t == 'Condition') {
			this.parenL(exports._Call, 0)
			this.expand(n.fn)
			this.parenR(exports._Call, 0)
		}
		else this.expand(n.fn)

		this.parenL(exports._Call, 0)

		var has_newlines = false
		if(this.comments(n.cm1)) has_newlines = true
		var old_indent = this.indent
		//if(has_newlines)
		this.indent++

		// cleanup hack

		// lets check if it has a newline
		//var first_is_obj
		if(!has_newlines && n.args.length>0 && (n.args[0].type === 'Object' || n.args[0].type === 'Array' || n.args[0].type === 'Function')){
			first_is_obj = true
			if(n.args.length === 1) this.indent--
		}

		for(var i = 0; i < n.args.length; i++){
			var arg = n.args[i]
			if(!arg)continue
			this.comments(arg.cmu)
			if(this.lastIsNewline()) this.tab(this.indent)

			var has_nl = this.expand(arg)

			// check wether to switch to has_newlines
			if(i === 0 && !has_newlines){
				has_newlines = has_nl
			}

			if(i < n.args.length - 1) this.comma(exports._Call, 2*256+this.post_comma)
			if(has_newlines && !this.comments(arg.cmr))
				this.newline()
			//else this.space()
		}
		if(has_newlines && this.comments(n.cm2)) this.tab(this.indent - 1)
		if(this.lastIsNewline()) this.tab(old_indent)

		this.indent = old_indent
		this.parenR(exports._Call, 0)

		return has_newlines
	}

	exports.types = {
		// Base node markers
		_Id:1,
		_Property:2,
		_Value:3,
		_This:4,
		_Array:5,
		_Object:6,
		_Index:7,
		_Key:8,
		_ThisCall: 9,

		_Block:10,
		_List: 11,
		_Comprehension:12,
		_Template: 13,
		_Break:14,
		_Continue:15,
		_Label:16,

		_If:17,
		_Switch:18,
		_Case:19,

		_Throw:20,
		_Try:21,

		_While:22,
		_DoWhile:23,
		_For:24,
		_ForIn:25,
		_ForOf:26,

		_Var:27,

		_Def:28,

		_Function:29,
		_Return:30,
		_Yield:31,
		_Await:32,

		_Unary:33,
		_Binary:34,
		_Logic:35,
		_Assign:36,
		_Update:37,
		_Condition:38,

		_New:39,
		_Call:40,
		_Nest:41,

		_Class:42,
		_Rest:43,
		_Comment:44,

		// second level markers
			_Id:1,
			_Paren:2,
				_ParenL:1,
				_ParenR:2,
			_Brace:3,
				_BraceL:1,
				_BraceR:2,
			_Bracket:4,
				_BracketL:1,
				_BracketR:2,

			_Comma:5,
			_Colon:6,
			_DColon:7,
			_Dot:8,
			_SemiColon:9,

			_Operator:10,
				_Plus:1,
				_Min:2,
				_Div:3,
				_Mul:4,
				_Pow:5,
				_Shl:6,
				_Shr:7,
				_EQ:8,
				_NEQ:9,
				_GT:10,
				_LT:11,
				_GTE:12,
				_LTE:13,
				_Plusplus:14,
				_Minmin:15,
				_Assign:16,
				_PlusAssign:17,
				_MinAssign:18,
				_MulAssign:19,
				_DivAssign:20,
				_ShlAssign:21,
				_ShrAssign:22,
				_TerniaryQ:23,
				_TerniaryC:24,
				_Signal:25,
			_String:11,
			_Number:12,
			_Tab:13,
			_Keyword:14,
			_Color:15
	}

	for(var key in exports.types) exports[key] = exports.types[key]

	exports.ops ={
		'++':exports._Plusplus,
		'--':exports._Minmin,
		'+':exports._Plus,
		'-':exports._Min,
		'/':exports._Div,
		'*':exports._Mul,
		'**':exports._Pow,
		'==':exports._EQ,
		'!=':exports._NEQ,
		'>':exports._GT,
		'<':exports._LT,
		'=>':exports._GTE,
		'<=':exports._LTE,
		'<<':exports._Shl,
		'>>':exports._Shr,
		'=':exports._Assign,
		':=':exports._Signal,
		'+=':exports._PlusAssign,
		'-=':exports._MinAssign,
		'/=':exports._DivAssign,
		'*=':exports._MulAssign,
		'<<=':exports._ShlAssign,
		'>>=':exports._ShrAssign,
		'?':exports._TerniaryQ,
		':':exports._TerniaryC
	}

})
