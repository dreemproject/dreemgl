
define.class(function(require, exports){
	
	var Parser = require('$system/parse/onejsparser')

	exports.walk = function(ast, textbuf, add){
		var glwalker = new this()
		glwalker.line = 0
		glwalker.textbuf = textbuf
		glwalker.add = add
		glwalker.expand(ast)
	}

	this.atConstructor = function(){
		this.indent = 0
	}

	// helper functions
	this.dColon = function(type, group){
		this.add('::', group, type, exports._DColon)
	}

	this.dot = function(type, group){
		this.add('.', group, type, exports._Dot)
	}

	this.colon = function(type, group){
		this.add(':', group, type, exports._Colon)
	}

	this.semiColon = function(type, group){
		this.add(';', group, type, exports._SemiColon)
	}

	this.comma = function(type, group){
		this.add(',', group, type, exports._Comma)
	}

	this.parenL = function(type, group){
		this.add('(', group, type, exports._Paren, exports._ParenL)
	}

	this.parenR = function(type, group){
		this.add(')', group, type, exports._Paren, exports._ParenL)
	}

	this.braceL = function(type, group){
		this.add('{', group, type, exports._Brace, exports._BraceL)
	}

	this.braceR = function(type, group){
		this.add('}', group, type, exports._Brace, exports._BraceR)
	}

	this.bracketL = function(type, group){
		this.add('[', group, type, exports._Bracket, exports._BracketL)
	}

	this.bracketR = function(type, group){
		this.add(']', group, type, exports._Bracket, exports._BracketR)
	}

	this.operator = function(op, type, group){
		this.add(op, group, type, exports._Operator, exports.ops[op])
	}

	this.keyword = function(value, type, group){
		this.add(value, group || 0, type, exports._Keyword)
	}

	this.tab = function(indent){
		this.add(Array(indent+1).join('\t') )
	}

	this.space = function(){
		this.add(' ')
	}


	this.newline = function(){
		this.line++
		this.add('\n')
	}

	this.comment = function(text, pre){
		if(this.lastIsNewline()) this.tab(this.indent), pre = ''
		this.add((pre||'') + '//' + text, this.group++, exports._Comment)
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
			else this[n.type](n, arg)
		}
	}

	// AST nodes
	this.Program = function(n){
		this.Block(n, true)
	}

	this.Empty = function(n){}

	this.Id = function(n){
		this.add(n.name, this.group++, exports._Id)
	}

	this.Value = function(n){//: { value:0, raw:0, kind:0, multi:0 },
		if(n.kind == 'num')
			this.add(n.raw, this.group++, exports._Value, exports._Number)
		else if(n.kind == 'string')
			this.add(n.raw, this.group++, exports._Value, exports._String)
		else
			this.add(n.raw, this.group++, exports._Value)
	}
	
	this.This = function(n){//: { },
		this.add('this', this.group++, exports._This, exports._Keyword)
	}

	this.Array = function(n){//: { elems:2 },
		var mygroup = this.group++
		this.bracketL(exports._Array, mygroup)

		var has_newlines = false
		if(this.comments(n.cm1)) has_newlines = true
		var old_indent = this.indent
		this.indent++

		for(var i = 0; i < n.elems.length; i++){
			var elem = n.elems[i]
			if(!has_newlines && i) this.comma(exports._Array, this.group++)
			this.comments(elem.cmu)
			if(this.lastIsNewline()) this.tab(this.indent)
			this.expand(elem)
			if(has_newlines && !this.comments(elem.cmr))
				this.newline()
		}
		if(has_newlines && this.comments(n.cm2)) this.tab(this.indent - 1)
		
		if(this.lastIsNewline()) this.tab(old_indent)

		this.indent = old_indent
		this.bracketR(exports._Array, mygroup)
	}

	this.Object = function(n, indent){//: { keys:3 },
		var mygroup = this.group++
		this.braceL(exports._Object, mygroup)
		// allright so
		var has_newlines = false
		if(this.comments(n.cm1)) has_newlines = true
		var old_indent = this.indent
		this.indent++

		//console.log(this.indent)

		for(var i = 0; i < n.keys.length; i ++){
			var prop = n.keys[i]
			if(!has_newlines && i){
				this.comma(exports._Object, this.group++)
				this.space()
			}
			if(this.lastIsNewline()) this.tab(this.indent)
			if(has_newlines) this.comments(prop.cmu)
			if(this.lastIsNewline()) this.tab(this.indent)

			this.expand(prop.key)
			if(prop.value){
				this.colon(exports._Object)
				this.expand(prop.value)
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
		this.braceR(exports._Object, mygroup)
	}

	this.Index = function(n){//: { object:1, index:1 },
		this.expand(n.object)
		var mygroup = this.group++
		this.bracketL(exports._Index, mygroup)
		if(n.index) this.expand(n.index)
		this.bracketR(exports._Index, mygroup)
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
		var mygroup = this.group++
		var old_indent = 0
	
		if(!skipbrace){
			this.braceL(exports._Block, mygroup)
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
			this.braceR(exports._Block, mygroup)
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
		var mygroup = this.group++
		this.space()
		this.parenL(exports._If, mygroup)
		this.expand(n.test)
		this.parenR(exports._If, mygroup)
		this.space()
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
			this.space()
			if(n.else.cmu){
				if(this.comments(n.else.cmu)) this.tab(this.indent+1)
			}
			this.expand(n.else)
			//debug()
		}
	}

	this.Switch = function(n){//: { on:1, cases:2 },
		this.keyword('switch', _Switch)
		this.space()
		var mygroup = group++
		this.parenL(_Switch, mygroup)
		this.expand(n.on)
		this.parenR(_Switch, mygroup)
		this.space()
		this.braceL(_Switch, mygroup)

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
		this.braceR(exports._Switch, mygroup)
	}

	this.Case = function(n){//: { test:1, then:2 },
		this.comments(n.cmu)
		if(!this.lastIsNewline()) this.newline()
		this.tab(indent)
		this.keyword('case', exports._Case)
		this.space()
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
		this.space()
		this.expand(n.arg)
	}

	this.Try = function(n){//: { try:1, arg:1, catch:1, finally:1 },
		this.Keyword('try', exports._Try)
		this.expand(n.try)
		this.Keyword('catch', exports._Try)
		var mygroup = this.group++
		this.parenL(exports._Try, mygroup)
		this.expand(n.arg)
		this.parenR(exports._Try, mygroup)
		this.expand(n.catch)
		if(n.finally){
			this.keyword('finally', exports._Try)
			this.expand(n.finally)
		}
	}

	this.While = function(n){//: { test:1, loop:1 },
		this.keyword('while', exports._While)
		var mygroup = this.group++
		this.parenL(exports._While, mygroup)
		this.expand(n.test)
		this.parenR(exports._While, mygroup)
		this.expand(n.loop)
	}

	this.DoWhile = function(n){//: { loop:1, test:1 },
		this.keyword('do', exports._Do)
		this.expand(n.loop)
		this.keyword('while', exports._Do)
		var mygroup = this.group++
		this.parenL(exports._Do, mygroup)
		this.expand(n.test)
		this.parenR(exports._Do, mygroup)
	}

	this.For = function(n){//: { init:1, test:1, update:1, loop:1, compr:0 },
		this.keyword('for', exports._For)
		var mygroup = this.group++
		this.space()
		this.parenL(exports._For, mygroup)
		this.expand(n.init)
		this.semiColon(exports._For)
		this.space()
		this.expand(n.test)
		this.semiColon(exports._For)
		this.space()
		this.expand(n.update)
		this.parenR(exports._For, mygroup)
		if(n.loop.cmu){
			if(this.comments(n.loop.cmu)) this.tab(this.indent + 1)
		}
		else if(n.loop.type != 'Block') this.space()
		this.expand(n.loop)
	}

	this.ForIn = function(n){//: { left:1, right:1, loop:1, compr:0 },
		this.keyword('for', exports._For)
		var mygroup = this.group++
		this.space()
		this.parenL(exports._For, mygroup)
		this.expand(n.left)
		this.space()
		this.keyword('in', exports._For)
		this.space()
		this.expand(n.right)
		this.parenR(exports._For, mygroup)
		if(n.loop.cmu){
			if(this.comments(n.loop.cmu)) this.tab(this.indent + 1)
		}
		else if(n.loop.type != 'Block') this.space()

		this.expand(n.loop)
	}

	this.ForOf = function(n){//: { left:1, right:1, loop:1, compr:0 },
		this.keyword('for', exports._For)
		var mygroup = this.group++
		this.space()
		this.parenL(exports._For, mygroup)
		this.expand(n.left)
		this.space()
		this.keyword('of', exports._For)
		this.space()
		this.expand(n.right)
		this.parenR(exports._For, mygroup)
		if(n.loop.cmu){
			if(this.comments(n.loop.cmu)) this.tab(this.indent + 1)
		}
		else if(n.loop.type != 'Block') this.space()

		this.expand(n.loop)
	}

	this.Var = function(n){//: { defs:2, const:0 },
		this.keyword('var', exports._Var)
		if(n.defs && n.defs.length){
			this.space()
			for(var i = 0; i < n.defs.length; i++){
				if(i) this.comma(exports._Var), this.space()
				this.expand(n.defs[i])
			}
		}
	}

	this.Def = function(n){//: { id:1, init:1, dim:1 },
		this.expand(n.id)
		if(n.init){
			this.space()
			this.operator('=', exports._Def, this.group++)
			this.space()
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
		var mygroup = this.group++
		this.parenL(exports._Function, mygroup)
	
		if(n.params) for(var i = 0; i < n.params.length; i++){
			if(i){
				this.comma(exports._Function), this.space()
			}

			this.expand(n.params[i])
		}
	
		if(n.rest){
			if(i) this.comma(exports._Function), this.space()
			this.expand(n.rest)
		}

		this.parenR(exports._Function, mygroup)
		if(n.arrow=='=>') this.operator('=>', exports._Function)
		else this.space()
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
		var mygroup = this.group++
		if(paren_l) this.parenL(exports._Binary, mygroup)
		this.expand(n.left)
		if(paren_l) this.parenR(exports._Binary, mygroup)
		var old_indent = this.indent
		this.indent++
		if(n.cm1 && this.comments(n.cm1,' ')){
			this.tab(this.indent)
		}
		else this.space()
		this.operator(n.op, exports._Binary, this.group++)
		if(n.cm2 && this.comments(n.cm2,' ')){
			this.tab(this.indent)
		}
		else this.space()
		if(paren_r) this.parenL(exports._Binary, mygroup)
		this.expand(n.right)
		if(paren_r) this.parenR(exports._Binary, mygroup)
		this.indent = old_indent
	}

	this.Logic = function(n){//: { op:0, prio:0, left:1, right:1 },
		var paren_l = Parser.needsParens(n, n.left, true)
		var paren_r = Parser.needsParens(n, n.right)
		var mygroup = this.group++
		if(paren_l) this.parenL(exports._Logic, mygroup)
		this.expand(n.left)
		if(paren_l) this.parenR(exports._Logic, mygroup)
		var old_indent = this.indent
		this.indent++
		if(n.cm1 && this.comments(n.cm1,' ')){
			this.tab(this.indent)
		}
		else this.space()
		this.operator(n.op, exports._Logic, this.group++)
		if(n.cm2 && this.comments(n.cm2,' ')){
			this.tab(this.indent)
		}
		else this.space()
		if(paren_r) this.parenL(exports._Logic,mygroup)
		this.expand(n.right)
		if(paren_r) this.parenR(exports._Logic,mygroup)
		this.indent = old_indent
	}

	this.Assign = function(n){//: { op:0, prio:0, left:1, right:1 },
		this.expand(n.left)
		var old_indent = this.indent
		this.indent++
		if(n.cm1 && this.comments(n.cm1,' ')){
			this.tab(this.indent)
		}
		else this.space()
		this.operator(n.op, exports._Assign, this.group++)
		if(n.cm2 && this.comments(n.cm2,' ')){
			this.tab(this.indent)
		}
		else this.space()
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
			if(i) this.comma(exports._New), this.space()
			this.expand(n.args[i])
		}
		this.parenR(exports._New)
	}

	this.Call = function(n){//: { fn:1, args:2 },
		var mygroup = this.group++
		var fn_t = n.fn.type
		if(fn_t == 'Function' || fn_t == 'List' || fn_t == 'Logic' || fn_t == 'Condition') {
			this.parenL(exports._Call, mygroup)
			this.expand(n.fn)
			this.parenR(exports._Call, mygroup)
		}
		else this.expand(n.fn)
		mygroup = this.group++
		this.parenL(exports._Call, mygroup)

		// if we get an argument with newlines
		this.indent++
		var line = this.line
		for(var i = 0; i < n.args.length; i++){
			if(i){
				this.comma(exports._Call), this.space()
				if(line !== this.line){
					this.newline()
					this.tab(this.indent)
				}
			}
			var arg = n.args[i]
			if(arg.type === 'Object'){
				this.indent--
				this.expand(arg, i < n.args.length - 1?true:false)
				this.indent++
			}
			else{
				this.expand(arg)
			}
		}
		this.indent--
		if(line !== this.line && this.lastCharCode() !== 125){
			this.newline()
			this.tab(this.indent)
		}
		this.parenR(exports._Call, mygroup)
	}

	exports.types = {
		// Base node markers
		_Id:1,
		_Value:2,
		_This:3,
		_Array:4,
		_Object:5,
		_Index:6,
		_Key:7,
		_ThisCall: 8,

		_Block:9,
		_List: 10,
		_Comprehension:11,
		_Template: 12,
		_Break:13,
		_Continue:14,
		_Label:15,

		_If:16,
		_Switch:17,
		_Case:18,

		_Throw:19,
		_Try:20,

		_While:21,
		_DoWhile:22,
		_For:23,
		_ForIn:24,
		_ForOf:25,
		_ForFrom:26,
		_ForTo:27,

		_Var:28,
		_TypeVar:29,
		_Struct:30,
		_Define:31,
		_Enum:32,

		_Def:33,

		_Function:34,
		_Return:35,
		_Yield:36,
		_Await:37,

		_Unary:38,
		_Binary:39,
		_Logic:40,
		_Assign:41,
		_Update:42,
		_Condition:43,

		_New:44,
		_Call:45,
		_Nest:46,

		_Class:47,
		_Signal:48,
		_Quote:49,
		_AssignQuote:50,
		_Rest:51,
		_Then:52,
		_Comment:53,

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