/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

// Parts Copyright (C) Marijn Haverbeke (Apache 2.0 license)

define.class(function(require, exports){

	// This parser is a modified version of Acorn
	// It parses the ONEJS superset of JavaScript
	// which is JS + ES6, Julia, Coffeescript, CSS, Dart and C++ / GLSL constructs
	// Its designed to target JS, Asm.js and GLSL with codegeneration
	// It tries to be entirely backwards compatible with JS
	// and follows the current ES6 proposals as closely as practical
	//
	// The Parser AST has been designed to be human friendly,
	// and with the quote operator makes ASTs a first class citizen of the language
	// check one_ast.js for structural definition of the AST
	// 
	// Think JavaScript, plus (inspiration language on the left)

	// ES6   member defs can drop the function keyword 'x(param){}''
	// ES6   arrow function '=>x', 'x=>x', '()=>x', '(x)=>x' and all =>{} forms
	// ES6   full destructuring assignment of arrays and objects in var, arguments and expressions
	// ES6   default arguments for functions '(x=10)->x'
	// ES6   rest prefix '...name' '(x, ...y) -> {}''
	// ES6   for of 'for(x of y){}' for iterators, arrays and objects
	// ES6   enum type
	// ES6   await async: var x = await async(y)
	// ES6   getter setter syntax:  'get x()->10' 'set y(v)->out(v)'
	// ES6   const
	// ES6   array comprehensions
	// ES6   String templates `hello ${i} test` ($ is optional)
	// ES6   Binary and Octal numbers according to new 0b and 0o spec
	// ES6   Shorthand object intialization {x,y} == {x:x,y:y} 
	// ES6	 class x extends y{} notation

	// Microsoft research use of the @ 'probe' operator anywhere
	// ONE   use of : to signify symbolic assignment
	// ONE   Create instance object with block args x{}
	// ONE   function defs can drop the identifier 'x = (param){}'
	// ONE   for To 'for(x = 0 to 10 in 3){}'
	// ONE   ! is postfixable,  % * & are prefixable 
	// ONE   do catch for promise-then: 'v(x) do y catch z' -> 'v(x,y,z)' 'v do x' -> 'v(x)'
	// ONE   then chaining on do catch: v(x).then do y catch z then do x catch z (for promises)
	// ONE 	 This replacement call 'x::y()' x.y.call(this,...)

	// Julia callback to a function after closing paren with do 'x() do ->{code}' 
	// Julia AST Quote operator 'var x = :y = 10' quotes entire expression rhs, priority below = 
	// GLSL  typed var 'float x' 'float x[10]' 
	// GLSL  struct support 'struct x{float y}'
	// Dart  tempvar/cascade operator (..)  'selectElement()..prop1=1 \n..prop2 = 10, ..prop3 = 20'
	// Coco  multiline regex / /\n\n\n/ /g
	// CSS   # is a prefix flag that the compiler uses for colors
	// CSS   automatic * insertion in '2px' -> '2*px' for units or math

	// CS    commas are optional when you have newlines '[1\n2] {x:1\x:2}'
	// CS    existential object traverse  'x?.y?.z for no exception-traverse
	// CS    existential assignments '?=' if(lhs===undefined)lhs = rhs
	// CS    existential prefix operator ?x -> (x===undefined)
	// CS    existential or '?|' lhs!==undefined?lhs:rhs

	// CS    pow '**'
	// CS    Mathematical modulus '%%'
	// CS    Integer divide '%/' ( cant parse // since thats a comment)

	// The following JS parser bugs/features have been fixed/changed:

	// Doing 'x\n()' or 'x\n[]' subscripts is now 2 statements, not an accidental call/index
	// This makes coding without semicolons completely predictable and safe.
	// MIGHT REVERT: Loose blocks in program scope like '{x:1}' are now interpreted as objects
	// Only 'new identifier' is treated as a the JS new keyword calling new() and new{} is usable syntax
	// Dont parse 0131 as octal, its almost always a  typo
	// label: syntax has been depricated and is used as lazy-eval and signal assigns

	// Code generation features depend on the target language

	// Todo
	// Support C like pointer access using -> and * and &
	// For from and for to have a step / in argument
	// ES6 let block scoped variables
	// Parse inline markup mixed with code
	//
	// items not done
	// Ranges '[0 to 1]' '[0 to 3]' maybe.
	// add catch to await
	// ES6 generator comprehensions
	// 
	// Acorn was written by Marijn Haverbeke and released under an MIT
	// license. The Unicode regexps (for identifiers and whitespace) were
	// taken from [Esprima](http:*esprima.org) by Ariya Hidayat.
	//
	// Git repositories for Acorn are available at
	//
	//     http:*marijnhaverbeke.nl/git/acorn
	//     https:*github.com/marijnh/acorn.git
	//
	// A second optional argument can be given to further configure
	// the parser process. These options are recognized:

	this.input = ''
	this.inputLen = 0

	// `ecmaVersion` indicates the ECMAScript version to parse. Must
	// be either 3 or 5. This
	// influences support for this.strict mode, the set of reserved words, and
	// support for getters and setter.
	this.ecmaVersion = 5

	// Turn on `strictSemicolons` to prevent the parser from doing
	// automatic this.semicolon insertion.
	this.strictSemicolons = false
	// When `allowTrailingCommas` is false, the parser will not allow
	// trailing commas in array and object literals.
	this.allowTrailingCommas = true
	// By default, reserved words are not enforced. Enable
	// `forbidReserved` to enforce them. When this option has the
	// value "everywhere", reserved words and keywords can also not be
	// used as property names.
	this.forbidReserved = false
	// Parses { } in top level scope as JS objects, not blocks.
	// Fixes use for throwing in plain JSON without switching
	// to expression mode
	this.objectInTopLevel = true
	// When enabled, commas are injected where possible
	this.injectCommas = true
	// When enabled, a return at the top level is not considered an
	// error.
	this.allowReturnOutsideFunction = true

	// stores comments and newline info on the AST as best as we can
	this.storeComments = true
	
	// allows multiline strings
	this.multilineStrings = true

	// allow string templating
	this.stringTemplating = true

	this.sourceFile = ''

	// The current position of the tokenizer in the this.input.
	this.tokPos = 0

	// The start and end offsets of the current token.

	this.tokStart = 0
	this.tokEnd = 0

	// The type and value of the current token. Token types are objects,
	// named by variables against which they can be compared, and
	// holding properties that describe them (indicating, for example,
	// the precedence of an infix operator, and the original name of a
	// keyword token). The kind of value that's held in `this.tokVal` depends
	// on the type of the token. For literals, it is the literal value,
	// for operators, the operator name, and so on.

	this.tokType
	this.tokVal

	// Interal state for the tokenizer. To distinguish between division
	// operators and regular expressions, it remembers whether the last
	// token was one that is allowed to be followed by an expression.
	// (If it is, a slash is probably a regexp, if it isn't it's a
	// division operator. See the `this.parseStatement` function for a
	// caveat.)

	this.tokRegexpAllowed

	// These store the position of the previous token, which is useful
	// when finishing a node and assigning its `end` position.
	this.lastTok
	this.lastStart
	this.lastEnd

	// used by comma insertion and subscripts
	this.skippedNewlines
	this.lastSkippedNewlines

	// This is the parser's state. `this.inFunction` is used to reject
	// `return` statements outside of functions, `this.labels` to verify that
	// `break` and `continue` have somewhere to jump to, and `this.strict`
	// indicates whether this.strict mode is on.

	this.inFunction
	this.labels
	this.strict

	// This function is used to this.raise exceptions on parse errors. It
	// takes an offset integer (into the current `this.input`) to indicate
	// the location of the error, attaches the position to the end
	// of the error message, and then raises a `SyntaxError` with that
	// message.
	this.lastComments = []
	this.lastNodes = []

	// alright parsing templating/interpolations.
	this.parenStack

	exports.parse = function(inpt){
		var parser = new this()
		return parser.parse(inpt)
	}

	this.parse = function(inpt) {
		if(this.parser_cache){
			var cache = this.parser_cache[inpt]
			if(cache) return cache
		}
		this.input = String(inpt)
		this.inputLen = this.input.length
		this.initTokenState()
		var ret = this.parseTopLevel()
		if(this.parser_cache){
			this.parser_cache[inpt] = ret
		}
		return ret
	}

	// The `this.getLineInfo` function is mostly useful when the
	// `locations` option is off (for performance reasons) and you
	// want to find the line/column position for a given character
	// offset. `this.input` should be the code string that the offset refers
	// into.

	this.getLineInfo = function( input, offset ) {
		for (var line = 1, cur = 0;;) {
			this.lineBreak.lastIndex = cur
			var match = this.lineBreak.exec(this.input)
			if (match && match.index < offset) {
				++line
				cur = match.index + match[0].length
			} else break
		}
		return {line: line, column: offset - cur}
	}

	this.raise = function(pos, message) {
		var loc = this.getLineInfo(this.input, pos)
		message += " in " + this.sourceFile + " line " + loc.line + " column " + loc.column 
		var err = new SyntaxError(message)
		err.pos = pos; err.loc = loc; err.raisedAt = this.tokPos

		console.log(message, this.input.split("\n")[loc.line-1])

		throw err
	}

	// Reused this.empty array added for node fields that are always this.empty.

	this.empty = []

	// ## Token types

	// The assignment of fine-grained, information-carrying type objects
	// allows the tokenizer to store the information it has about a
	// token in a way that is very cheap for the parser to look up.

	// All token type variables start with an underscore, to make them
	// easy to recognize.

	// These are the general types. 

	this._num = {type: "num", canInj:1}
	this._regexp = {type: "regexp", canInj:1}
	this._string = {type: "string", canInj:1}
	this._name = {type: "name", canInj:1}
	this._eof = {type: "eof"}
	// templated string type
	this._template = {}

	// Keyword tokens. The `keyword` property (also used in keyword-like
	// operators) indicates that the token originated from an
	// identifier-like word, which is used when parsing property names.
	//
	// The `beforeExpr` property is used to disambiguate between regular
	// expressions and divisions. It is set on all token types that can
	// be followed by an expression (thus, a slash after them would be a
	// regular expression).
	//
	// `isLoop` marks a keyword as starting a loop, which is important
	// to know when parsing a label, in order to allow or disallow
	// continue jumps to that label.

	this._break = {keyword: "break"}
	this._case = {keyword: "case", beforeExpr: true}
	this._catch = {keyword: "catch"}
	this._continue = {keyword: "continue"}
	this._debugger = {keyword: "debugger"}
	this._default = {keyword: "default"}
	this._do = {keyword: "do", isLoop: true}
	this._on = {keyword: "on", isLoop: true}
	this._else = {keyword: "else", beforeExpr: true}
	this._finally = {keyword: "finally"}
	this._for = {keyword: "for", isLoop: true}
	this._function = {keyword: "function"}
	this._if = {keyword: "if"}
	this._return = {keyword: "return", beforeExpr: true}
	this._yield = {keyword: "yield", beforeExpr: true}
	this._await = {keyword: "await", beforeExpr: true}

	this._switch = {keyword: "switch"}
	this._throw = {keyword: "throw", beforeExpr: true}
	this._try = {keyword: "try"}
	this._var = {keyword: "var"}
	//this._const = {keyword: "const"}
	this._while = {keyword: "while", isLoop: true}
	this._with = {keyword: "with", preIdent:this._name}
	this._new = {keyword: "new", preIdent:this._name, beforeExpr: true}
	this._this = {keyword: "this"}

	// class extends 
	this._extends = {keyword:"extends", preIdent:this._name}
	this._class = {keyword:"class", preIdent:this._name}
	this._struct = {keyword:"struct", preIdent:this._name}
	this._enum = {keyword:"enum", preIdent:this._name}

	// The keywords that denote values.
	this._null = {keyword: "null", isValue:1, atomValue: null}
	this._true = {keyword: "true", isValue:1, atomValue: true}
	this._false = {keyword: "false", isValue:1, atomValue: false}

	// Some keywords are treated as regular operators. `in` sometimes
	// (when parsing `for`) needs to be tested against specifically, so
	// we assign a variable name to it for quick comparing.

	this._in = {keyword: "in", preIdent:this._name, binop: 7, beforeExpr: true}
	this._of = {keyword: "of", preIdent:this._name, binop: 7, beforeExpr: true}

	this._instanceof = {keyword: "instanceof", preIdent:this._name, binop: 7, beforeExpr: true}, 
	this._typeof = {keyword: "typeof", preIdent:this._name, prefix: true, beforeExpr: true}
	this._void = {keyword: "void", preIdent:this._name, prefix: true, beforeExpr: true}
	this._delete = {keyword: "delete", preIdent:this._name, prefix: true, beforeExpr: true}

	// Punctuation token types.
	this._bracketL = {type: "[", beforeExpr: true, canInj:1}
	this._bracketR = {type: "]"}
	this._braceL = {type: "{", beforeExpr: true, canInj:1}
	this._braceR = {type: "}"}
	this._parenL = {type: "(", beforeExpr: true, canInj:1}
	this._parenR = {type: ")"}
	this._comma = {type: ",", beforeExpr: true}
	this._semi = {type: ";", beforeExpr: true}
	this._colon = {type: ":", prefix: 1, beforeExpr: true}
	this._doublecolon = {type:"::"}
	this._dot = {type: ".", canInj:1}
	this._dotdot = {type: ".."}
	this._tripledot = {type: "..."}

	this._existkey = {type: "?."}
	this._existor = {type: "?|", binop:1, beforeExpr:true, logic:1}
	this._existeq = {type: "?=",isAssign: true, binop:0, beforeExpr: true}
	this._wtfeq = {type: "??=",isAssign: true, binop:0, beforeExpr: true}
	this._wtf = {type: "??", binop:1, beforeExpr:true}

	this._question = {type: "?", prefix: true, beforeExpr: true}
	this._fatArrow = {type:"=>"}
	this._thinArrow = {type:"->"}
	
	// Operators. These carry several kinds of properties to help the
	// parser use them properly (the presence of these properties is
	// what categorizes them as operators).
	//
	// `binop`, when present, specifies that this operator is a binary
	// operator, and will refer to its precedence.
	//
	// `prefix` and `postfix` mark the operator as a prefix or postfix
	// unary operator. `isUpdate` specifies that the node produced by
	// the operator should be of type UpdateExpression rather than
	// simply UnaryExpression (`++` and `--`).
	//
	// `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
	// binary operators with a very low precedence, that should result
	// in AssignmentExpression nodes.

	this._slash = {binop: 10, beforeExpr: true}
	this._eq = {isAssign: true, beforeExpr: true}
	this._assign = {isAssign: true, binop:0, beforeExpr: true}
	this._incDec = {postfix: true, prefix: true, isUpdate: true}
	this._notxor = {prefix: true, beforeExpr: true}
	this._exists = {prefix: true, beforeExpr: true}

	this._logicalOR = {binop: 1, beforeExpr: true, logic:1}
	this._logicalAND = {binop: 2, beforeExpr: true, logic:1}
	this._bitwiseOR = {binop: 3, beforeExpr: true}
	this._bitwiseXOR = {binop: 4, beforeExpr: true}
	this._bitwiseAND = {binop: 5, prefix:true, beforeExpr: true}
	this._equality = {binop: 6, beforeExpr: true, logic:1}
	this._relational = {binop: 7, beforeExpr: true, logic:1}
	this._bitShift = {binop: 8, beforeExpr: true}
	this._plusMin = {binop: 9, prefix: true, beforeExpr: true}
	this._multiplyModulo = {binop: 10, prefix:true, beforeExpr: true}
	this._pow = {binop: 10, beforeExpr: true}
	this._intmod = {binop: 10, beforeExpr: true}
	this._intdiv = {binop: 10, beforeExpr: true}
	
	//this._or = {keyword: "or", replace:'||', replaceOp:this._logicalOR, binop: 1, beforeExpr: true}
	//this._and = {keyword: "and", replace:'&&', replaceOp:this._logicalAND, binop: 2, beforeExpr: true}
	//this._not = {keyword: "not", replace:'!', prefix: 1, beforeExpr: true}

	// This is a trick taken from Esprima. It turns out that, on
	// non-Chrome browsers, to check whether a string is in a set, a
	// predicate containing a big ugly `switch` statement is faster than
	// a regular expression, and on Chrome the two are about on par.
	// This function uses `eval` (non-lexical) to produce such a
	// predicate from a space-separated string of words.
	//
	// It starts by sorting the words by length.

	this.makePredicate = function(words) {
		words = words.split(" ")
		var f = "", cats = []
		out: for (var i = 0; i < words.length; ++i) {
			for (var j = 0; j < cats.length; ++j)
				if (cats[j][0].length == words[i].length) {
					cats[j].push(words[i])
					continue out
				}
			cats.push([words[i]])
		}
		this.compareTo = function(arr) {
			if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";"
			f += "switch(str){"
			for (var i = 0; i < arr.length; ++i) f += "case " + JSON.stringify(arr[i]) + ":"
			f += "return true}return false;"
		}

		// When there are more than three length categories, an outer
		// switch first dispatches on the lengths, to save on comparisons.

		if (cats.length > 3) {
			cats.sort(function(a, b) {return b.length - a.length;})
			f += "switch(str.length){"
			for (var i = 0; i < cats.length; ++i) {
				var cat = cats[i]
				f += "case " + cat[0].length + ":"
				this.compareTo(cat)
			}
			f += "}"

		// Otherwise, simply generate a flat `switch` statement.

		} else {
			this.compareTo(words)
		}
		return new Function("str", f)
	}

	this._isReservedWord3 = "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"
	this._isReservedWord5 = "class enum extends super const export import"
	this._isStrictReservedWord = "implements interface let package private protected public static yield"
	this._isStrictBadIdWord = "eval arguments"

	this.initKeywords = function(){
		var isKeyword = ''
		this.keywordTypes = {}
		this.tokTypes = {}
		for( var k in this ){
			var v = this[ k ]

			if(k[0] == '_'){
				if(typeof v === 'object'){
					v.toString = (function(k){
						return function(){
							return 'Token:'+k
						}
					})(k)
				}
				if((v.binop || v.type || v.keyword)){ // its a token
					this.tokTypes[ k.slice(1) ] = v
					if(v.keyword){
						this.keywordTypes[ v.keyword ] = v
						isKeyword += (isKeyword.length?' ':'') + v.keyword
					}
				}
			}
		}
		this.isKeyword = this.makePredicate(isKeyword)
		this.isReservedWord3 = this.makePredicate(this._isReservedWord3)
		this.isReservedWord5 = this.makePredicate(this._isReservedWord5)
		this.isStrictReservedWord = this.makePredicate(this._isStrictReservedWord)
		this.isStrictBadIdWord = this.makePredicate(this._isStrictBadIdWord)
	}

	// If you externally modify things, call this again
	this.initKeywords()

	// ## Character categories

	// Big ugly regular expressions that match characters in the
	// whitespace, identifier, and identifier-start categories. These
	// are only applied when a character is found to actually have a
	// code point above 128.

	this.nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/
	this.nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc"
	this.nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f"
	this.nonASCIIidentifierStart = new RegExp("[" + this.nonASCIIidentifierStartChars + "]")
	this.nonASCIIidentifier = new RegExp("[" + this.nonASCIIidentifierStartChars + this.nonASCIIidentifierChars + "]")

	// Whether a single character denotes a this.newline.

	this.newline = /[\n\r\u2028\u2029]/

	// Matches a whole line break (where CRLF is considered a single
	// line break). Used to count lines.

	this.lineBreak = /\r\n|[\n\r\u2028\u2029]/g

	// Test whether a given character code starts an identifier.
	exports.needsParens = function(node, other, isleft){
		var other_t = other.type

		if(other_t == 'Assign' || other_t == 'List' || other_t == 'Condition' || 
			(other_t == 'Binary' || other_t == 'Logic') && other.prio <= node.prio){
			if(other.prio == node.prio && isleft) return false
			return true
		}
	}


	exports.isIdentifierStart = 
	this.isIdentifierStart = function(code) {
		if (code < 65) return code === 36 || code === 35 
		if (code < 91) return true
		if (code < 97) return code === 95
		if (code < 123)return true
		return code >= 0xaa && this.nonASCIIidentifierStart.test(String.fromCharCode(code))
	}

	// Test whether a given character is part of an identifier.
	exports.isIdentifierChar = 
	this.isIdentifierChar = function(code) {
		if (code < 48) return code === 36 || code === 35
		if (code < 58) return true
		if (code < 65) return false
		if (code < 91) return true
		if (code < 97) return code === 95
		if (code < 123)return true

		return code >= 0xaa && this.nonASCIIidentifier.test(String.fromCharCode(code))
	}

	exports.isNewLine =
	this.isNewLine = function(code){
		return this.newline.test(String.fromCharCode(code))
	}

	exports.isNonNewlineWhiteSpace =
	this.isNonNewlineWhiteSpace = function(code) {
		if(code == 32) return true
		if(code == 9) return true
		return code >= 0xaa && this.nonASCIIwhitespace.test(String.fromCharCode(code))
	}

	exports.isWhiteSpace =
	this.isWhiteSpace = function(code) {
		if(code == 32) return true
		if(code == 9) return true
		if(code == 10) return true
		return code >= 0xaa && this.nonASCIIwhitespace.test(String.fromCharCode(code))
	}


	// ## Tokenizer

	// Reset the token state. Used at the start of a parse.

	this.initTokenState = function() {
		this.parenStack = []
		this.lastTok = undefined
		this.skippedNewlines = false
		this.lastSkippedNewlines = false
		this.lastComments.length = 0 
		this.lastNodes.length = 0
		this.tokPos = 0
		this.tokRegexpAllowed = true
		this.templateNext = false
		this.skipSpace()
	}

	// Called at the end of every token. Sets `this.tokEnd`, `this.tokVal`, and
	// `this.tokRegexpAllowed`, and skips the space after the token, so that
	// the next one's `this.tokStart` will point at the right position.

	this.finishToken = function(type, val) {
		//console.log('FINISH TOKEN',type)
		if(this.storeComments) this.lastComments.push(type)
		this.tokEnd = this.tokPos
		this.tokType = type
		//this.tokIsType = this.typeKeywords[val]
		this.skipSpace()
		if(type.preIdent){
			var next = this.input.charCodeAt(this.tokPos)
			if(!this.isIdentifierStart(next) && (next<48 || next>57)){
				this.tokType = type.preIdent
			}
		}
		this.tokVal = val
		this.tokRegexpAllowed = type.beforeExpr
	}
	
	this.skipBlockComment = function() {
		var start = this.tokPos, end = this.input.indexOf("*/", this.tokPos += 2)
		if (end === -1) this.raise(this.tokPos - 2, "Unterminated comment")
		if( this.input.indexOf("\n", this.tokPos ) < end ) this.skippedNewlines = 1
		this.tokPos = end + 2
		
		if(this.storeComments){
		
			var block = this.input.slice(start + 2, end).split("\n")
			for( var i = 0;i<block.length;i++){
				this.lastComments.push( /*start,*/ block[ i ] )
				if(i < block.length - 1) this.lastComments.push( /*start,*/ 1 )
			}
			this.lastComments.push( /*start,*/ 1)
		}
	}

	this.skipLineComment = function() {

		var start = this.tokPos
		var ch = this.input.charCodeAt(this.tokPos+=2)
		while (this.tokPos < this.inputLen && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
			++this.tokPos
			ch = this.input.charCodeAt(this.tokPos)
		}
		// store the comment
		if(this.storeComments){
			var strip = start + 2
			var ch = this.input.charCodeAt(strip)
			while(strip < this.tokPos && ( ch > 8 && ch < 14 || ch == 32)){
				 ch = this.input.charCodeAt(++strip)
			}
			var cmt = this.input.slice(strip, this.tokPos)
			this.lastComments.push( /*start,*/ cmt )
			//console.log('COMMENT',cmt)

		}
	}

	// Called at the start of the parse and after every token. Skips
	// whitespace and comments, and.

	this.skipSpace = function() {

		this.lastSkippedNewlines = this.skippedNewlines
		this.skippedNewlines = 0
		if( this.templateNext ) return
		while (this.tokPos < this.inputLen) {
			var ch = this.input.charCodeAt(this.tokPos)
			if (ch === 32) { // ' '
				++this.tokPos
			} 
			else if (ch === 13) {
				++this.tokPos
				var next = this.input.charCodeAt(this.tokPos)
				if (next === 10) {
					++this.tokPos
				}
				this.skippedNewlines++
				if(this.storeComments) this.lastComments.push(/*this.tokPos-2,*/ 1)
			} 
			else if (ch === 10 || ch === 8232 || ch === 8233) {
				++this.tokPos
				this.skippedNewlines++
				if(this.storeComments) this.lastComments.push(/*this.tokPos-1,*/ 1)
			} 
			else if (ch > 8 && ch < 14) {
				++this.tokPos
			} 
			else if (ch === 47) { // '/'
				var next = this.input.charCodeAt(this.tokPos + 1)
				if (next === 42) { // '*'
					this.skipBlockComment()
				} else if (next === 47) { // '/'
					this.skipLineComment()
				} else break
			} 
			else if (ch === 160) { // '\xa0'
				++this.tokPos
			} 
			else if (ch >= 5760 && this.nonASCIIwhitespace.test(String.fromCharCode(ch))) {
				++this.tokPos
			} 
			else {
				break
			}
		}
	}

	// ### Token reading

	// This is the function that is called to fetch the next token. It
	// is somewhat obscure, because it works in character codes rather
	// than characters, and because operator parsing has been inlined
	// into it.
	//
	// All in the name of speed.
	//
	// The `forceRegexp` parameter is used in the one case where the
	// `this.tokRegexpAllowed` trick does not work. See `this.parseStatement`.

	this.readToken_dot = function() {
		var next = this.input.charCodeAt(this.tokPos + 1)
		if (next >= 48 && next <= 57) return this.readNumber(true)
		if( next == 46){
			next = this.input.charCodeAt(this.tokPos + 2)
			var after = this.input.charCodeAt(this.tokPos + 3)
			if( next == 46 && after != 46){
				this.tokPos += 3
				return this.finishToken(this._tripledot)
			}
			this.tokPos += 2
			return this.finishToken(this._dotdot)
		} // double dot
		++this.tokPos
		return this.finishToken(this._dot)
	}

	this.readToken_slash = function() {// '/'
		var next = this.input.charCodeAt(this.tokPos + 1)
		if (this.tokRegexpAllowed) {
			if(next == 32 && this.input.charCodeAt(this.tokPos + 2) == 47){
				this.tokPos += 3
				return this.readRegexp(true)				
			}
			++this.tokPos
			return this.readRegexp()
		}
		if (next === 61) return this.finishOp(this._assign, 2)
		return this.finishOp(this._slash, 1)
	}

	this.readToken_multiply = function() { // '*'
		var next = this.input.charCodeAt(this.tokPos + 1)
		
		if (next === 42) return this.finishOp(this._pow, 2)
		if (next === 61) return this.finishOp(this._assign, 2)

		return this.finishOp(this._multiplyModulo, 1)
	}

	this.readToken_modulo = function() { // '%'
		var next = this.input.charCodeAt(this.tokPos + 1)

		if (next === 47) return this.finishOp(this._intdiv, 2)
		if (next === 37) return this.finishOp(this._intmod, 2)
		if (next === 61) return this.finishOp(this._assign, 2)

		return this.finishOp(this._multiplyModulo, 1)
	}

	this.readToken_pipe_amp = function(code) { // '|&'
		var next = this.input.charCodeAt(this.tokPos + 1)
		if (next === code) return this.finishOp(code === 124 ? this._logicalOR : this._logicalAND, 2)
		if (next === 61) return this.finishOp(this._assign, 2)
		return this.finishOp(code === 124 ? this._bitwiseOR : this._bitwiseAND, 1)
	}

	this.readToken_caret = function() { // '^'
		var next = this.input.charCodeAt(this.tokPos + 1)
		if (next === 61) return this.finishOp(this._assign, 2)
		return this.finishOp(this._bitwiseXOR, 1)
	}

	this.readToken_plus_min = function(code) { // '+-'
		var next = this.input.charCodeAt(this.tokPos + 1)
		if (next === code) {
			if (next == 45 && this.input.charCodeAt(this.tokPos + 2) == 62 &&
					this.newline.test(this.input.slice(this.lastEnd, this.tokPos))) {
				// A `-->` line comment
				this.tokPos += 3
				this.skipLineComment()
				this.skipSpace()
				return this.readToken()
			}
			return this.finishOp(this._incDec, 2)
		}
		if (next === 61) return this.finishOp(this._assign, 2)
		return this.finishOp(this._plusMin, 1)
	}

	this.readToken_lt_gt = function(code) { // '<>'
		var next = this.input.charCodeAt(this.tokPos + 1)
		var size = 1
		if (next === code) {
			size = code === 62 && this.input.charCodeAt(this.tokPos + 2) === 62 ? 3 : 2
			if (this.input.charCodeAt(this.tokPos + size) === 61) return this.finishOp(this._assign, size + 1)
			return this.finishOp(this._bitShift, size)
		}
		if (next == 33 && code == 60 && this.input.charCodeAt(this.tokPos + 2) == 45 &&
				this.input.charCodeAt(this.tokPos + 3) == 45) {
			// `<!--`, an XML-style comment that should be interpreted as a line comment
			this.tokPos += 4
			this.skipLineComment()
			this.skipSpace()
			return this.readToken()
		}
		if (next === 61)
			size = this.input.charCodeAt(this.tokPos + 2) === 61 ? 3 : 2
		return this.finishOp(this._relational, size)
	}

	this.readToken_eq_excl = function(code) { // '=!'
		var next = this.input.charCodeAt(this.tokPos + 1)
		if (next === 61) return this.finishOp(this._equality, this.input.charCodeAt(this.tokPos + 2) === 61 ? 3 : 2)
		return this.finishOp(code === 61 ? this._eq : this._notxor, 1)
	}

	this.getTokenFromCode = function(code) {
		switch(code) {
			// The interpretation of a dot depends on whether it is followed
			// by a digit.
		case 46: // '.'
			return this.readToken_dot()

			// Punctuation tokens.
		case 40: ++this.tokPos; 
			this.parenStack.push(40)
			return this.finishToken(this._parenL)
		case 41: ++this.tokPos; 
			if( this.parenStack.pop() !== 40) this.raise(this.tokPos, "Unexpected )")
			return this.finishToken(this._parenR)
		case 59: ++this.tokPos; 
			return this.finishToken(this._semi)
		case 44: ++this.tokPos; 
			return this.finishToken(this._comma) 
		case 91: ++this.tokPos; 
			this.parenStack.push(91)
			return this.finishToken(this._bracketL)
		case 93: ++this.tokPos; 
			if( this.parenStack.pop() !== 91) this.raise(this.tokPos, "Unexpected ]")
			return this.finishToken(this._bracketR)
		case 123: ++this.tokPos; 
			this.parenStack.push(123)
			return this.finishToken(this._braceL)
		case 125: 
			var ps = this.parenStack
			if( ps.pop() !== 123) this.raise(this.tokPos, "Unexpected }")
			if( ps.length && ps[ps.length-1] == 96){
				this.templateNext = true
				ps.pop()
			} else ++this.tokPos; 
			return this.finishToken(this._braceR)
		case 58: ++this.tokPos; 
			var next = this.input.charCodeAt(this.tokPos)
			if(next == 58){
				++this.tokPos
				return this.finishToken(this._doublecolon)
			}
			return this.finishToken(this._colon)
		case 63: 
			++this.tokPos
			var next = this.input.charCodeAt(this.tokPos)
			if(next == 46){
				++this.tokPos
				if(this.input.charCodeAt(this.tokPos) == 46){
					++this.tokPos
					this.isExistStore = true 
				} else this.isExistStore = false
				return this.finishToken(this._existkey)
			}
			if(next == 124){
				++this.tokPos
				return this.finishToken(this._existor,'?|')
			}
			if(next == 63){
				++this.tokPos
				var next = this.input.charCodeAt(this.tokPos)
				if(next == 61){
					++this.tokPos
					return this.finishToken(this._haspropeq,'??=')
				}
				return this.finishToken(this._hasprop,'??')
			}
			if(next == 61){
				++this.tokPos
				return this.finishToken(this._existeq,'?=')
			}
			return this.finishToken(this._question,'?')

			// '0x' is a hexadecimal number.
		case 48: // '0'
			var next = this.input.charCodeAt(this.tokPos + 1)
			if (next === 120 || next === 88) return this.readHexNumber() //0x 0X
			if (next === 66 || next === 98) return this.readBinNumber() //0b 0B
			if (next === 79 || next === 111) return this.readOctNumber() //0o 0O

			// Anything else beginning with a digit is an integer, octal
			// number, or float.
		case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
			return this.readNumber(false)

			// Quotes produce strings.

		case 34: case 39: case 96:// '"', "'", "`"
			return this.readString(code)

		// Operators are parsed inline in tiny state machines. '=' (61) is
		// often referred to. `this.finishOp` simply skips the amount of
		// characters it is given as second argument, and returns a token
		// of the type given by its first argument.

		case 47: // '/'
			return this.readToken_slash(code)

		case 37: // %
			return this.readToken_modulo()

		case 42: // '*'
			return this.readToken_multiply()

		case 124: case 38: // '|&'
			return this.readToken_pipe_amp(code)

		case 94: // '^'
			return this.readToken_caret()

		case 43: 
			return this.readToken_plus_min(code)
		case 45: // '+-'
			var next = this.input.charCodeAt(this.tokPos + 1)
			if( next == 62 ){
				this.tokPos += 2
				return this.finishToken(this._thinArrow, '->')
			}		
			var next = this.input.charCodeAt(this.tokPos + 1)
			return this.readToken_plus_min(code)

		case 60: case 62: // '<>'
			return this.readToken_lt_gt(code)

		case 61: 
			var next = this.input.charCodeAt(this.tokPos + 1)
			if(next == 62){
				this.tokPos += 2
				return this.finishToken(this._fatArrow, '=>')
			}
		
		case 33: // '=!'
			return this.readToken_eq_excl(code)

		case 126: // '~'
			return this.finishOp(this._notxor, 1)
		}

		return false
	}

	this.readToken = function(forceRegexp) {
		// in templated string check
		this.probe_flag = false
		if(this.templateNext){ 
			this.templateNext = false
			return this.readString(96)
		}

		if (!forceRegexp) this.tokStart = this.tokPos
		else this.tokPos = this.tokStart + 1
		if (forceRegexp) return this.readRegexp()
		if (this.tokPos >= this.inputLen) return this.finishToken(this._eof)

		var code = this.input.charCodeAt(this.tokPos)
		if(code == 64){
			this.tokPos ++
			var tok = this.readToken(forceRegexp)
			this.probe_flag = true
			return tok
		}
		// Identifier or keyword. '\uXXXX' sequences are allowed in
		// identifiers, so '\' also dispatches to that.
		if (this.isIdentifierStart(code) || code === 92 /* '\' */) return this.readWord()

		var tok = this.getTokenFromCode(code)

		if (tok === false) {
			// If we are here, we either found a non-ASCII identifier
			// character, or something that's entirely disallowed.
			var ch = String.fromCharCode(code)
			if (ch === "\\" || this.nonASCIIidentifierStart.test(ch)) return this.readWord()
			this.raise(this.tokPos, "Unexpected character '" + ch + "'")
		}
		return tok
	}

	this.finishOp = function(type, size) {
		var str = this.input.slice(this.tokPos, this.tokPos + size)
		this.tokPos += size
		this.finishToken(type, str)
	}

	// Parse a regular expression. Some context-awareness is necessary,
	// since a '/' inside a '[]' set does not end the expression.

	this.readRegexp = function(multiLine) {
		var content = "", escaped, inClass, start = this.tokPos
		for (;;) {
			if (this.tokPos >= this.inputLen) this.raise(start, "Unterminated regular expression")
			var ch = this.input.charAt(this.tokPos)
			if (!multiLine && this.newline.test(ch)) this.raise(start, "Unterminated regular expression")
			if (!escaped) {
				if (ch === "[") inClass = true
				else if (ch === "]" && inClass) inClass = false
				else if (ch === "/" && !inClass){
					if(multiLine){
						var next = this.input.charCodeAt(this.tokPos + 1)
						if(next == 47 || next == 42){ // its a /* */ comment to skip
							content += this.input.slice(start, this.tokPos)
							if(next == '*'){
								for(;;){
									this.tokPos ++
									if(this.input.charCodeAt(this.tokPos) == 42 &&
									   this.input.charCodeAt(this.tokPos+1) == 47){
										start = this.tokPos + 2
										break
									}
									if(this.tokPos >= this.inputLen) this.raise(start, "Unterminated regular expression")
								}
							} 
							else { // single line comment
								for(;;){
									this.tokPos ++
									if(this.input.charCodeAt(this.tokPos) == 10){
										start = this.tokPos + 1
										break
									}
									if(this.tokPos >= this.inputLen) this.raise(start, "Unterminated regular expression")
								}
							}
						}
						if( next == 32 && this.input.charCodeAt(this.tokPos + 2) == 47 ){
							break
						}
					} else break	
				}
				escaped = ch === "\\"
			} else escaped = false
			++this.tokPos
		}
		content += this.input.slice(start, this.tokPos)

		++this.tokPos
		if(multiLine) this.tokPos += 2
		// Need to use `this.readWord1` because '\uXXXX' sequences are allowed
		// here (don't ask).
		var mods = this.readWord1()
		if (mods && !/^[gmsiy]*$/.test(mods)) this.raise(start, "Invalid regular expression flag")
		try {
			if(multiLine) content = content.replace(/[\s\r\n]*/g,'')
			var value = new RegExp(content, mods)
		} catch (e) {
			if (e instanceof SyntaxError) this.raise(start, "Error parsing regular expression: " + e.message)
			this.raise(e)
		}
		this.regexContent = '/'+content+'/'+mods
		this.isMultiLine = multiLine
		return this.finishToken(this._regexp, value)
	}

	// Read an integer in the given radix. Return null if zero digits
	// were read, the integer value otherwise. When `len` is given, this
	// will return `null` unless the integer has exactly `len` digits.

	this.readInt = function(radix, len) {
		var start = this.tokPos, total = 0
		for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
			var code = this.input.charCodeAt(this.tokPos), val
			if (code >= 97) val = code - 97 + 10; // a
			else if (code >= 65) val = code - 65 + 10; // A
			else if (code >= 48 && code <= 57) val = code - 48; // 0-9
			else val = Infinity
			if (val >= radix) break
			++this.tokPos
			total = total * radix + val
		}
		if (this.tokPos === start || len != null && this.tokPos - start !== len) return null

		return total
	}

	this.readOctNumber = function(){
		this.tokPos += 2; // 0o
		var val = this.readInt(8)
		if(val == null ) this.raise(this.tokStart + 2, "Expected octal number")
		if (this.isIdentifierStart(this.input.charCodeAt(this.tokPos))) this.raise(this.tokPos, "Identifier directly after number")
		this.newNumSyntax = 1
		return this.finishToken(this._num, val)
	}

	this.readBinNumber = function(){
		this.tokPos += 2; // 0b
		var val = this.readInt(2)
		if(val == null ) this.raise(this.tokStart + 2, "Expected binary number")
		if (this.isIdentifierStart(this.input.charCodeAt(this.tokPos))) this.raise(this.tokPos, "Identifier directly after number")
		return this.finishToken(this._num, val)
	}

	this.readHexNumber = function() {
		this.tokPos += 2; // 0x
		var val = this.readInt(16)
		if (val == null) this.raise(this.tokStart + 2, "Expected hexadecimal number")
		if (this.isIdentifierStart(this.input.charCodeAt(this.tokPos))) this.raise(this.tokPos, "Identifier directly after number")
		return this.finishToken(this._num, val)
	}

	// Read an integer, octal integer, or floating-point number.

	this.readNumber = function(startsWithDot) {
		var start = this.tokPos, isFloat = false

		if (!startsWithDot && this.readInt(10) === null) this.raise(start, "Invalid number")
		if (this.input.charCodeAt(this.tokPos) === 46) {
			++this.tokPos
			this.readInt(10)
			isFloat = true
		}
		var next = this.input.charCodeAt(this.tokPos)
		if (next === 69 || next === 101) { // 'eE'
			next = this.input.charCodeAt(++this.tokPos)
			if (next === 43 || next === 45) ++this.tokPos; // '+-'
			if (this.readInt(10) === null) this.raise(start, "Invalid number")
			isFloat = true
		}

		if (this.isIdentifierStart(this.input.charCodeAt(this.tokPos))){
			this.injectMul = true
		}

		var str = this.input.slice(start, this.tokPos), val
		if (isFloat) val = parseFloat(str)
		else val = parseInt(str, 10)
		return this.finishToken(this._num, val)
	}
	// Read a string value, interpreting backslash-escapes.

	this.readString = function(quote) {
		this.tokPos++
		var out = ""
		this.isMultiLine = false
		for (;;) {
			if (this.tokPos >= this.inputLen) this.raise(this.tokStart, "Unterminated string constant")
			var ch = this.input.charCodeAt(this.tokPos)

			if (ch === quote) {
				++this.tokPos
				return this.finishToken(this._string, out)
			}
			if (ch === 92) { // '\'
				ch = this.input.charCodeAt(++this.tokPos)
				var octal = /^[0-7]+/.exec(this.input.slice(this.tokPos, this.tokPos + 3))
				if (octal) octal = octal[0]
				while (octal && parseInt(octal, 8) > 255) octal = octal.slice(0, -1)
				if (octal === "0") octal = null
				++this.tokPos
				if (octal) {
					if (this.strict) this.raise(this.tokPos - 2, "Octal literal in this.strict mode")
					out += String.fromCharCode(parseInt(octal, 8))
					this.tokPos += octal.length - 1
				} else {
					switch (ch) {
					case 110: out += "\n"; break; // 'n' -> '\n'
					case 114: out += "\r"; break; // 'r' -> '\r'
					case 120: out += String.fromCharCode(this.readHexChar(2)); break; // 'x'
					case 117: out += String.fromCharCode(this.readHexChar(4)); break; // 'u'
					case 85: out += String.fromCharCode(this.readHexChar(8)); break; // 'U'
					case 116: out += "\t"; break; // 't' -> '\t'
					case 98: out += "\b"; break; // 'b' -> '\b'
					case 118: out += "\u000b"; break; // 'v' -> '\u000b'
					case 102: out += "\f"; break; // 'f' -> '\f'
					case 48: out += "\0"; break; // 0 -> '\0'
					case 13: if (this.input.charCodeAt(this.tokPos) === 10) ++this.tokPos; // '\r\n'
					case 10: // ' \n'
						this.skippedNewlines = true
						break
					default: out += String.fromCharCode(ch); break
					}
				}
			} 
			else {
				// templated string
				if(quote == 96 && this.stringTemplating && 
					(ch == 36 && this.input.charCodeAt(this.tokPos+1) == 123)){
					if(ch == 36) this.tokPos++
					this.parenStack.push(96)
					return this.finishToken(this._template, out)
				}
				if (ch === 13 || ch === 10 || ch === 8232 || ch === 8233){
					if(!this.multilineStrings) this.raise(this.tokStart, "Unterminated string constant")
					this.isMultiLine = true
				}
				out += String.fromCharCode(ch); // '\'
				++this.tokPos
			}
		}
	}

	// Used to read character escape sequences ('\x', '\u', '\U').

	this.readHexChar = function(len) {
		var n = this.readInt(16, len)
		if (n === null) this.raise(this.tokStart, "Bad character escape sequence")
		return n
	}

	// Used to signal to callers of `this.readWord1` whether the word
	// contained any escape sequences. This is needed because words with
	// escape sequences must not be interpreted as keywords.

	this.containsEsc

	// reads ~ and ! as a flag on a word 
	this.containsFlag

	// injects a * as the next token
	this.injectMul

	// Read an identifier, and return it as a string. Sets `this.containsEsc`
	// to whether the word contained a '\u' escape.
	//
	// Only builds up the word character-by-character when it actually
	// containeds an escape, as a micro-optimization.


	this.readWord1 = function() {
		this.containsEsc = false
		this.containsFlag = false
		var word, first = true, start = this.tokPos
		for (;;) {
			var ch = this.input.charCodeAt(this.tokPos)
			if (this.isIdentifierChar(ch)) {
				if ( ch == 35 ){
					if( !first ) this.raise(this.tokPos, "# and @ cannot be used in the middle of a word")
					this.containsFlag = ch
					start++
				}
				if (this.containsEsc) word += this.input.charAt(this.tokPos)
				++this.tokPos
			} else if (ch === 92) { // "\"
				if (!this.containsEsc) word = this.input.slice(start, this.tokPos)
				this.containsEsc = true
				if (this.input.charCodeAt(++this.tokPos) != 117) // "u"
					this.raise(this.tokPos, "Expecting Unicode escape sequence \\uXXXX")
				++this.tokPos
				var esc = this.readHexChar(4)
				var escStr = String.fromCharCode(esc)
				if (!escStr) this.raise(this.tokPos - 1, "Invalid Unicode escape")
				if (!(first ? this.isIdentifierStart(esc) : this.isIdentifierChar(esc)))
					this.raise(this.tokPos - 4, "Invalid Unicode escape")
				word += escStr
			} else {
				break
			}
			first = false
		}
		var ret = this.containsEsc ? word : this.input.slice(start, this.tokPos)

		return ret
	}

	// Read an identifier or keyword token. Will check for reserved
	// words when necessary.

	this.readWord = function() {
		var word = this.readWord1()
		var type = this._name
		if (!this.containsEsc && this.isKeyword(word)){
			type = this.keywordTypes[word]
		}
		return this.finishToken(type, word)
	}

	// ## Parser

	// A recursive descent parser operates by defining functions for all
	// syntactic elements, and recursively calling those, each function
	// advancing the this.input stream and returning an AST node. Precedence
	// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
	// instead of `(!x)[1]` is handled by the fact that the parser
	// function that parses unary prefix operators is called first, and
	// in turn calls the function that parses `[]` subscripts — that
	// way, it'll receive the node for `x[1]` already parsed, and wraps
	// *that* in the unary operator node.
	//
	// Acorn uses an [operator precedence parser][opp] to handle binary
	// operator precedence, because it is much more compact than using
	// the technique outlined above, which uses different, nesting
	// functions to specify precedence, for all of the ten binary
	// precedence levels that JavaScript defines.
	//
	// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

	// ### Parser utilities

	// Continue to the next token.

	this.next = function() {
		this.lastStart = this.tokStart
		this.lastEnd = this.tokEnd
		this.lastTok = this.tokType
		if(this.injectMul){
			this.finishToken(this._multiplyModulo, "*")
			this.injectMul = false
			return	
		}
		this.readToken()
	}

	// Enter this.strict mode. Re-reads the next token to please pedantic
	// tests ("use this.strict"; 010; -- should fail).

	this.setStrict = function(strct) {
		this.strict = strct
		this.tokPos = this.tokStart
		this.skipSpace()
		this.readToken()
	}

	// Start an AST node, attaching a start offset.
	this.Node = {}
	this.lastDeferred = []

	this.finishComments = function(){
		// we take a comment, then walk lastNodes 
		var comments = this.lastComments
		var nodes    = this.lastNodes
		var clen = comments.length
		var nlen = nodes.length
		if(!clen || !nlen) return
		var c = 0
		var n = 0
		while( c < clen ){
			// we have a comment we want a place for
			var cpos = comments[c]
			while( n < nlen && nodes[n].end <= cpos ) n++
			if( n == nlen ){ // apply all our comments on the last node
				n--
				var out = nodes[n].comments = []
				while( c < clen ){
					if(nodes[n].end <= comments[c]) out.push( comments[c+1])
					c+=2
				}	
				break
			} else {
				n--
				if(n < 0) n = 0
				var out = nodes[n].comments || (nodes[n].comments = [])
				out.push( comments[ c+1 ])
			}
			c += 2
		}
		this.lastComments.length = 0
		this.lastNodes.length = 0
	}

	this.startNode = function() {

		var node = {
			_ast_:1,
			type:null,
			start: this.tokStart,
			end: this.tokStart
		}

		// lets process lastNodes against lastComments
		//if(this.storeComments && this.lastComments.length){
		//	this.lastNodes.push(node)
			//this.finishComments()
		//}

		return node
	}

	// Start a node whose start offset information should be based on
	// the start of another node. For example, a binary operator node is
	// only started after its left-hand side has already been parsed.

	this.startNodeFrom = function(other) {

		var node = {
			_ast_:1,
			type:null,
			end:null,
			start:other.start
		}

		return node
	}

	// Finish an AST node, adding `type` and `end` properties.

	this.finishNode = function(node, type) {
		node.type = type
		node.end = this.lastEnd
		if(this.storeComments) this.lastNodes.push( node )
		return node
	}

	// Test whether a statement node is the string literal `"use this.strict"`.

	this.isUseStrict = function(stmt) {
		return this.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" &&
			stmt.expression.type === "Literal" && stmt.expression.value === "use this.strict"
	}

	// Predicate that tests whether the next token is of the given
	// type, and if yes, consumes it as a side effect.

	this.eat = function(type) {
		if (this.tokType === type) {
			this.next()
			return true
		}
	}

	// Test whether a this.semicolon can be inserted at the current position.

	this.canInsertSemicolon = function() {
		return !this.strictSemicolons &&
			(this.tokType === this._eof || this.tokType === this._braceR || this.newline.test(this.input.slice(this.lastEnd, this.tokStart)))
	}

	// Consume a this.semicolon, or, failing that, see if we are allowed to
	// pretend that there is a this.semicolon at this position.

	this.semicolon = function() {
		if (!this.eat(this._semi) && !this.canInsertSemicolon()) this.unexpected()
	}

	// Expect a token of a given type. If found, consume it, otherwise,
	// this.raise an this.unexpected token error.

	this.expect = function(type) {
		if (this.tokType === type) this.next()
		else this.unexpected()
	}

	// Raise an this.unexpected token error.

	this.unexpected = function() {
		this.raise(this.tokStart, "Unexpected token")
	}

	// Verify that a node is an lval — something that can be assigned
	// to.

	this.checkLVal = function(expr) {
		if( expr.type === "Array" ){ // destructuring assignment
			this.raise(expr.start, "TODO add destructuring assignment")
		}
		if (expr.type !== "Id" && expr.type !== "Key" && expr.type !== "Index")
			this.raise(expr.start, "Assigning to rvalue" + expr.type)

		if (this.strict && expr.type === "Ident" && this.isStrictBadIdWord(expr.name))
			this.raise(expr.start, "Assigning to " + expr.name + " in this.strict mode")
	}

	// ### Statement parsing

	// Parse a program. Initializes the parser, reads any number of
	// statements, and wraps them in a Program node.  Optionally takes a
	// `program` argument.  If present, the statements will be appended
	// to its body instead of creating a new node.

	this.parseTopLevel = function() {
		this.lastStart = this.lastEnd = this.tokPos
		this.inFunction = this.strict = null
		this.labels = []
		this.readToken()
		var node = this.startNode(), first = true

		node.steps = []
		while (this.tokType !== this._eof) {
			if(this.storeComments) var cmt = this.commentBegin()
			var stmt = this.parseStatement( true )
			if(this.storeComments) this.commentEnd(stmt, cmt, this._braceR)

			node.steps.push(stmt)
			if (first && this.isUseStrict(stmt)) this.setStrict(true)
			first = false
		}
		// if we have end comments , put them on Program

		// alright so. how do we recognise these things
		if(this.storeComments) this.commentTail(node, this._braceR)
		var ret = this.finishNode(node, "Program")
		//this.finishComments()
		return ret
	}

	this.commentBegin = function(node){
		var comments = this.lastComments
		// we have to return the comments 'above' where we are. so
		// we cant just eat it all. 
		// what does that mean
		var out = []
		for(var i = 0, l = comments.length; i < l; i++){
			var item = comments[i]
			if(typeof item == 'object'){
				comments.splice(0, i + 1)
				break
			}
			out.push(item)
		}
		if(i == l) this.lastComments = []
		return out
	}
	
	this.commentEnd = function(node, prefix, tail){
		// process the prefix comments
		var out = []
		var split = false
		for(var i = 0, l = prefix.length; i < l; i++){
			var item = prefix[i]
			if(typeof item == 'object'){
				split = true 
				break
			}
			out.push(item)
		}
		// assign to up comments
		if(out.length) node.cmu = out
		var out = []
		if(split){
			for(i++; i < l; i++){ // push the rest of comments as things next to the item
				split = false
				var item = prefix[i]
				if(typeof item == 'object') break
				out.push(item)
			}
			if(!split){
				if(out.length) node.cmr = out
				return
			}
		}
		var comments = this.lastComments

		for(var i = 0, l = comments.length; i < l; i++){
			var item = comments[i]
			if(item === tail) break
 			if(typeof item !== 'object') break
		}

		for(; i < l; i++){
			var item = comments[i]
			if(typeof item == 'object'){
				comments.splice(0, i)
				if(out.length) node.cmr = out
				return
			}
			out.push(item)
			if(item === 1){
				comments.splice(0, i + 1)
				if(out.length) node.cmr = out
				return
			}
		}
		if(out.length) node.cmr = out
		comments.length = 0
	}
	// called on the head of a block
	this.commentHead = function(node){
		var out = []
		var comments = this.lastComments
		for(var i = 0, l = comments.length; i < l; i++){
			var item = comments[i]
			if(typeof item != 'object'){
				out.push(item)
				if(item === 1){
					comments.splice(0, i + 1)
					break
				}
			}
		}
		if(out.length) node.cm1 = out
	}
	// this is called at a } we run to it then splice and leave that for the next layer up
	this.commentTail = function(node, tail){
		var out = []
		var comments = this.lastComments
		//console.log('tail',cmt.join(','))
		for(var i = 0, l = comments.length;i<l;i++){
			var item = comments[i]
			if(item === tail){
				comments.splice(0, i + 1)
				break
			}
			if(typeof item !== 'object'){
				out.push(item)
			}
		}
		if(i==l){
			comments.length = 0
		}
		if(out.length) node.cm2 = out
	}

	this.commentInline = function(term){
		// ok so, we find all newlines and comments
		var out = []
		var any = false
		var comments = this.lastComments
		for(var i = 0, l = comments.length; i<l; i++){
			var item = comments[i]
			if(typeof item !== 'object'){
				out.push(item)
				any = true
			}
			else if(any || item === term){
				comments.splice(0, i + 1)
				return out
			}
		}
		this.lastComments = []
		return out
	}

	this.commentAround = function(node, token){
		var comments = this.lastComments
		for(var i = comments.length - 1;i>=0;i--){
			if(comments[i] == token){
				var out = []
				// scan backwards for the comments before
				for(var j = i - 1;j>=0;j++){
					var item = comments[j]
					if(typeof item === 'object') break
					out.unshift(item)
				}
				if(out.length) node.cm1 = out
				var out = []
				// scan forward for the comments after
				for(var j = i + 1; j < comments.length; j++){
					var item = comments[j]
					if(typeof item === 'object') break
					out.push(item)
				}
				if(out.length) node.cm2 = out
				comments.splice(0, j)
			}
		}
	}

	this.commentAfter = function(){
		// ok so, we find all newlines and comments
		var out = []
		var any = false
		var comments = this.lastComments
		var args = arguments, arglen = args.length
		for(var i = comments.length - 1;i>=0 ;i--){
			var brk = false
			for(var j = 0; j < arglen; j++) if(comments[i] === args[j]) brk = true
			if(brk) break
		}
		for(i++;i<comments.length;i++){
			var item = comments[i]
			if(typeof item === 'object'){
				comments.splice(0, i + 1)
				break
			}
			out.push(item)
		}
		return out
	}

	this.loopLabel = {kind: "loop"} 
	this.switchLabel = {kind: "switch"}

	// parse array dimensions
	/*
	this.parseDims = function( node, check ){
		 if( this.eat(this._bracketL) ){
			if( check && check.dim !== undefined ) this.unexpected()
			if( this.tokType == this._num ){
				var num = this.startNode()
				num.value = this.tokVal
				num.raw = this.input.slice(this.tokStart, this.tokEnd)
				this.next()
				node.dim = this.finishNode(num, "Value")
			} 
			else node.dim = 0
			if( !this.eat(this._bracketR) ) this.unexpected()
		}
	}*/

	// parse function args or variable defines with inits
	// and destructuring and and and it makes coffee too.
	this.parseDefs = function( noIn, defs, cantype ){
		defs = defs || []

		for (;;) {
			var def
			if(this.tokType == this._parenR) break
			if(this.tokType == this._dot) break
			if(this.tokType == this._bracketL){ // destructure object
				def = this.startNode()
				def.id = this.parseArray()
				if(this.eat(this._eq)){
					def.init = this.parseNoCommaExpression(noIn)
				}
			} 
			else if(this.tokType == this._braceL){ // destructure array
				def = this.startNode()
				def.id = this.parseObj()
				if(this.eat(this._eq)){
					def.init = this.parseNoCommaExpression(noIn)
				}
			} 
			else if(this.tokType !== this._name)break
			else{

				def = this.startNode()
				def.id = this.parseIdent()

				if (this.strict && this.isStrictBadIdWord(def.id.name))
					this.raise(def.id.start, "Binding " + def.id.name + " in this.strict mode")
				// dont allow newline before a function-init
				if( cantype && this.tokType == this._name && !this.lastSkippedNewlines){
					var id = this.parseIdent()
					id.typing = def.id
					def.id = id
					// support second type
					if( cantype && this.tokType == this._name && !this.lastSkippedNewlines){
						var id = this.parseIdent()
						id.typing = def.id
						def.id = id
					}
				}

				if( !this.lastSkippedNewlines && this.tokType == this._parenL){
					def.init = this.parseCall(def.id)
					// remove the name as its duplicate
					def.init.name = undefined
					def.init.fn = undefined
				}
				else {
					//this.parseDims(def, node)
					if(this.eat(this._eq)){
						def.init = this.parseNoCommaExpression(noIn)
					}
				}
			}
			defs.push(this.finishNode(def, "Def"))
			if (!this.eat(this._comma)) break
		}
		return defs
	}

	this.parseStatementBlock = function(){
		// this parses 
		if(this.tokType == this._braceL){
			return this.parseBlock()
		}
		var comment = this.commentAfter(this._parenR, this._else)
		var node = this.parseStatement()
		if(comment.length) node.cmu = comment
		return node
	}

	// Parse a single statement.
	//
	// If expecting a statement and finding a slash operator, parse a
	// regular expression literal. This is to handle cases like
	// `if (foo) /blah/.exec(foo);`, where looking at the previous token
	// does not help.

	this.parseStatement = function( ) {
		if (this.tokType === this._slash || this.tokType === this._assign && this.tokVal == "/=")
			this.readToken(true)

		var starttype = this.tokType, node = this.startNode()

		this.currentStatement = node

		// Most types of statements are recognized by the keyword they
		// start with. Many are trivial to parse, some require a bit of
		// complexity.

		switch (starttype) {
		case this._break: case this._continue:
			this.next()
			var isBreak = starttype === this._break

			if (this.tokType == this._if) return this.finishNode(node, isBreak ? "Break" : "Continue")

			if(!this.eat(this._semi) && !this.canInsertSemicolon()) this.unexpected()

			return this.finishNode(node, isBreak ? "Break" : "Continue")

		case this._debugger:
			this.next()
			this.semicolon()
			return this.finishNode(node, "Debugger")

		case this._do:
			this.next()
			this.labels.push(this.loopLabel)
			node.loop = this.parseStatementBlock()
			this.labels.pop()
			this.expect(this._while)
			node.test = this.parseParenExpression()
			this.semicolon()
			return this.finishNode(node, "DoWhile")

		case this._macro:
			this.next()
			// we parse a function def
			var node = this.parseFunction(node, true)
			node.type = 'Macro'
			return node

		case this._struct:
			this.next()
			if( this.tokType !== this._name ) this.unexpected()
			node.id = this.parseIdent()
			if(this.eat(this._extends)){
				node.base = this.parseIdent()
			}
			node.struct = this.parseBlock()
			return this.finishNode(node, "Struct")
		
		case this._enum:
			this.next()
			node.id = this.parseIdent()
			this.expect(this._braceL)
			node.enums = []
			for(;;){
				if(this.tokType == this._braceR) break
				var enm = this.startNode()
				if(this.tokType == this._string){
					var str = this.startNode()
					str.kind = "string"
					str.value = this.tokVal
					str.multi = this.isMultiLine
					str.raw = this.input.slice(this.tokStart, this.tokEnd)
					this.finishNode(str, 'Value')
					this.next()
					enm.id = str
				} 
				else{
					enm.id = this.parseIdent(true)
				}
				if(this.eat(this._eq)){
					enm.init = this.parseNoCommaExpression()
				}
				node.enums.push(this.finishNode(enm, "Def"))
				if(!this.canInjectComma(this.tokType) && !this.eat(this._comma)){
					break
				}
			}
			this.expect(this._braceR)
			return this.finishNode(node, "Enum")

			// Disambiguating between a `for` and a `for`/`in` loop is
			// non-trivial. Basically, we have to parse the init `var`
			// statement or expression, disallowing the `in` operator (see
			// the second parameter to `this.parseExpression`), and then check
			// whether the next token is `in`. When there is no init part
			// (this.semicolon immediately after the opening parenthesis), it is
			// a regular `for` loop.

		case this._for:
			this.next()
			this.labels.push(this.loopLabel)
			return this.parseAllFor(node)

		case this._function:
			this.next()
			return this.parseFunction(node, true)

		case this._if:
			this.next()
			node.test = this.parseParenExpression()
			node.then = this.parseStatementBlock()
			if(this.tokType == this._else){

				if(this.storeComments){
					node.cm1 = this.commentInline()//this._else)
				}
				this.eat(this._else)
				node.else = this.parseStatementBlock()
			}
			return this.finishNode(node, "If")

		case this._return:
			if (!this.inFunction && !this.allowReturnOutsideFunction)
				this.raise(this.tokStart, "'return' outside of function")
			this.next()

			// In `return` (and `break`/`continue`), the keywords with
			// optional arguments, we eagerly look for a this.semicolon or the
			// possibility to insert one.

			if (this.eat(this._semi) || this.canInsertSemicolon()) node.arg = null
			else { node.arg = this.parseExpression(); this.semicolon(); }
			return this.finishNode(node, "Return")

		case this._yield:
			this.next()

			if (this.eat(this._semi) || this.canInsertSemicolon()) node.arg = null
			else { node.arg = this.parseExpression(); this.semicolon(); }
			return this.finishNode(node, "Yield")

		case this._switch:
			this.next()
			node.on = this.parseParenExpression()
			node.cases = []

			if(this.storeComments) this.commentHead(node)

			this.expect(this._braceL)
			this.labels.push(this.switchLabel)
			// Statements under must be grouped (by label) in SwitchCase
			// nodes. `cur` is used to keep the node that we are currently
			// adding statements to.

			for (var cur, sawDefault; this.tokType != this._braceR;) {

				if(this.storeComments){
					var cmt = this.commentBegin()
				}
				if (this.tokType === this._case || this.tokType === this._default) {
					var isCase = this.tokType === this._case
					if (cur) this.finishNode(cur, "Case")
					node.cases.push(cur = this.startNode())
					cur.steps = []
					this.next()
					if (isCase) cur.test = this.parseExpression(false, true)
					else {
						if (sawDefault) this.raise(this.lastStart, "Multiple default clauses"); sawDefault = true
						cur.test = null
					}
					this.expect(this._colon)
					if(this.storeComments)this.commentEnd(cur, cmt)
				} 
				else {
					if (!cur) this.unexpected()
					var step = this.parseStatement()
					cur.steps.push(step)
					if(this.storeComments){
						this.commentEnd(step, cmt)
					}
				}
			}

			if (cur) this.finishNode(cur, "Case")
			this.next(); // Closing brace
			this.labels.pop()

			if(this.storeComments) this.commentTail(node, this._braceR)

			return this.finishNode(node, "Switch")

		case this._throw:
			this.next()
			if (this.newline.test(this.input.slice(this.lastEnd, this.tokStart)))
				this.raise(this.lastEnd, "Illegal this.newline after throw")
			node.arg = this.parseExpression()
			this.semicolon()
			return this.finishNode(node, "Throw")

		case this._try:
			this.next()
			node.try = this.parseBlock()
			if (this.tokType === this._catch) {
				this.next()
				this.expect(this._parenL)
				node.arg = this.parseIdent()
				if (this.strict && this.isStrictBadIdWord(clause.arg.name))
					this.raise(clause.param.start, "Binding " + clause.param.name + " in this.strict mode")
				this.expect(this._parenR)
				node.catch = this.parseBlock()
			}
			node.finally = this.eat(this._finally) ? this.parseBlock() : null
			if (!node.catch && !node.finally)
				this.raise(node.start, "Missing catch or finally clause")
			return this.finishNode(node, "Try")

		//case this._const:
		//	node.const = true;
		case this._var:
			this.next()
			this.parseVar(node)
			this.semicolon()

			return this.finishNode(node, "Var")

		case this._class:
			this.next()
			node.id = this.parseIdent()
			if(this.eat(this._extends)){
				// we should parse Ident and then 
				var base = this.parseIdent()
				node.base = this.parseSubscripts(base, true)
				if(node.base.type !== 'Id' && node.base.type !== 'Index' &&
				   node.base.type !== 'Key') this.unexpected()
			}
			if(this.tokType !== this._braceL) this.unexpected()
			node.body = this.parseStatementBlock()
			return this.finishNode(node, "Class")

		case this._while:

			this.next()
			node.test = this.parseParenExpression()
			this.labels.push(this.loopLabel)
			node.loop = this.parseStatementBlock()
			this.labels.pop()
			return this.finishNode(node, "While")

		case this._with:
			if (this.strict) this.raise(this.tokStart, "'with' in this.strict mode")
			this.next()
			node.object = this.parseParenExpression()
			node.body = this.parseStatementBlock()
			return this.finishNode(node, "With")

		case this._semi:
			this.next()
			return this.finishNode(node, "Empty")

		default:
			// parse #define here
			if(this.tokType == this._name && this.tokVal == 'define' && 
				this.isIdentifierStart(this.input.charCodeAt(this.tokPos))){
				this.next()
				if(this.lastSkippedNewlines) this.unexpected()
				// we should be able to parse an id,
				// and then ( ) arguments, and then a define
				var base = this.parseIdent()

				if(this.lastSkippedNewlines) this.unexpected()
				if(this.eat(this._parenL)){
					var macro = this.startNodeFrom(base)
					macro.fn = base
					macro.args = this.parseExprList(this._parenR, false)
					this.finishNode(macro, "Call")
					node.id = macro
					// if we have  { } we are parsing a macro function.
					if(this.tokType == this._braceL){
						if(this.lastSkippedNewlines) this.unexpected()
						// we have to turn the macro into a function
						var fn = this.startNodeFrom(node.id)
						node.id =  this.parseArrowFunction(fn, node.id)
						//node.value = this.parseStatementBlock()
						return this.finishNode(node, "Define")
					}
				}
				else node.id = base
				if(this.lastSkippedNewlines) this.unexpected()

				node.value = this.parseExpression()
				return this.finishNode(node, "Define")
			}

			var maybeName = this.tokVal, expr = this.parseExpression(false, false, true)

			if (starttype === this._name && expr.type === "Id" && this.eat(this._colon)) {
				node.left = expr
				if(this.eat(this._eq)){
					node.right = this.parseNoCommaExpression()
					this.eat(this._comma)
					return this.finishNode(node, "Signal")
				}
				else{
					node.quote = this.parseNoCommaExpression()
					this.eat(this._comma)
					return this.finishNode(node, "AssignQuote")
				}
			} 
			else {
				if(this.tokType != this._else) this.semicolon()
				return expr
			}
		}
	}

	// Used for constructs like `switch` and `if` that insist on
	// parentheses around their expression.
	this.parseParenExpression = function() {
		this.expect(this._parenL)
		var val = this.parseExpression()
		this.expect(this._parenR)
		return val
	}

	// Parse a this.semicolon-enclosed block of statements, handling `"use
	// this.strict"` declarations when `allowStrict` is true (used for
	// function bodies).

	this.parseBlock = function(allowStrict) {
		var node = this.startNode(), first = true, strict = false, oldStrict
		node.steps = []
		// this pops the comment we need to store on the body
		if(this.storeComments) this.commentHead(node)
		this.expect(this._braceL)

		while (!this.eat(this._braceR)) {
			// first we see if we have any comments
			if(this.storeComments){
				var cmt = this.commentBegin()
			}
			var stmt = this.parseStatement()
			//console.log("HERE", stmt)
			if(this.storeComments) this.commentEnd(stmt, cmt, this._braceR)
			node.steps.push(stmt)
			if (first && allowStrict && this.isUseStrict(stmt)) {
				oldStrict = strict
				this.setStrict(strict = true)
			}
			first = false
		}
		if (this.strict && !oldStrict) this.setStrict(false)
		if(this.storeComments) this.commentTail(node, this._braceR)

		return this.finishNode(node, "Block", true)
	}

	// parse a comprehension block
	this.parseComprBlock = function(){
		// we can parse either a for or an if or an expression
		if(this.tokType == this._for){
			var node = this.startNode()
			this.eat(this._for)
			node.compr = true
			return this.parseAllFor(node, true)
		}
		else if(this.tokType == this._if){

			var node = this.startNode()
			this.next()
			// if we dont have a paren, we switch to if .. then
			if( this.tokType !== this._parenL ){
				node.test = this.parseNoCommaExpression()
				if( this.tokVal != 'then' ) this.unexpected()
				this.next()
			} else {
				node.test = this.parseParenExpression()
			}
			node.then = this.parseComprBlock()
			node.else = this.eat(this._else) ? this.parseComprBlock() : null
			node.compr = true
			return this.finishNode(node, 'If')
		}
		return this.parseExpression()
	}

	this.parseAllFor = function(node, compr){
		this.expect(this._parenL)

		if (this.tokType === this._semi) return this.parseFor(node, null, compr)
		// its either a var, or the next token starts with an id
		var is_typed
		if (this.tokType === this._var || (is_typed=this.isIdentifierStart(this.input.charCodeAt(this.tokPos)))){
			var init = this.startNode()
			if(is_typed){
				init.typing = this.parseIdent()
				init.defs = this.parseDefs(true)
				this.finishNode(init, "TypeVar")
			}
			else{
				this.next()
				this.parseVar(init, true)
				this.finishNode(init, "Var")
			}

			if (this.tokType == this._of){
				this.next()
				return this.parseForOf(node, init, compr)
			}

			if (this.tokType == this._name && this.tokVal == 'from'){
				this.next()
				return this.parseForFrom(node, init, compr)
			}

			if( init.defs.length === 1 ){
				if (this.eat(this._in)) return this.parseForIn(node, init, compr)
				if (this.tokType == this._name && this.tokVal == 'to'){
					this.next()
					return this.parseForTo(node, init, compr)
				}
			}

			return this.parseFor(node, init)
		}
		var init = this.parseExpression(true)

		if (this.eat(this._in)) return this.parseForIn(node, init, compr)


		if(this.tokType == this._of){
			this.next()
			return this.parseForOf(node, init, compr)
		}
		else if (this.tokType == this._name){
			if(this.tokVal == 'to'){
				this.next()
				return this.parseForTo(node, init, compr)
			}
			if(this.tokVal == 'from'){
				this.next()
				return this.parseForFrom(node, init, compr)
			}
		}

		return this.parseFor(node, init)
	}
	// Parse a regular `for` loop. The disambiguation code in
	// `this.parseStatement` will already have parsed the init statement or
	// expression.

	this.parseFor = function(node, init, compr) {
		node.init = init
		this.expect(this._semi)
		node.test = this.tokType === this._semi ? null : this.parseExpression()
		this.expect(this._semi)
		node.update = this.tokType === this._parenR ? null : this.parseExpression()
		this.expect(this._parenR)
		if(compr) node.loop = this.parseComprBlock()
		else node.loop = this.parseStatementBlock()
		this.labels.pop()
		return this.finishNode(node, "For")
	}

	// Parse a `for`/`in` loop.

	this.parseForIn = function(node, init, compr) {
		node.left = init
		node.right = this.parseExpression()
		this.expect(this._parenR)
		if(compr) node.loop = this.parseComprBlock()
		else node.loop = this.parseStatementBlock()
		return this.finishNode(node, "ForIn")
	}

	// Parse a `for`/`to` loop.

	this.parseForTo = function(node, init, compr) {

		node.left = init
		node.right = this.parseNoCommaExpression(true)
		if( this.eat(this._in) ){
			node.in = this.parseNoCommaExpression(true)
		}
		this.expect(this._parenR)
		if(compr){
			node.loop = this.parseComprBlock()
		}
		else { 
			node.loop = this.parseStatementBlock()
			this.labels.pop()
		}
		return this.finishNode(node, "ForTo")
	}

	// Parse a `for`/`of` loop.

	this.parseForOf = function(node, init, compr) {
		node.left = init
		node.right = this.parseExpression()
		this.expect(this._parenR)
		if(compr){	
			node.loop = this.parseComprBlock()
		}
		else {
			node.loop = this.parseStatementBlock()
			this.labels.pop()
		}
		return this.finishNode(node, "ForOf")
	}

	// Parse a for from optimized array loop
	this.parseForFrom = function(node, init, compr) {
		node.left = init
		node.right = this.parseExpression()
		this.expect(this._parenR)
		if(compr) node.loop = this.parseComprBlock()
		else {
			node.loop = this.parseStatementBlock()
			this.labels.pop()
		}
		return this.finishNode(node, "ForFrom")
	}
	// Parse a list of variable declarations.
	this.parseVar = function(node, noIn) {
		node.kind = "var"
		node.defs = this.parseDefs( noIn )
		return node
	}

	// Determines if a comma injection is safe
	this.canInjectComma = function( type ) {
		return  this.injectCommas && 
			this.lastSkippedNewlines && (
			type.canInj ||
			type.isValue ||
			type.prefix)
	}

	// ### Expression parsing

	// These nest, from the most general expression type at the top to
	// 'atomic', nondivisible expression types at the bottom. Most of
	// the functions will simply let the function(s) below them parse,
	// and, *if* the syntactic construct they handle is present, wrap
	// the AST node that the inner parser gave them in another node.

	// Parse a full expression. The arguments are used to forbid comma
	// sequences (in argument lists, array literals, or object literals)
	// or the `in` operator (in for loops initalization expressions).

	this.parseExpression = function(noIn, termColon, inStatement) {

		var expr = this.parseMaybeQuote(noIn)

		if(inStatement && (
			expr.type == 'Index' && expr.object.kind || 
			expr.type == 'Assign' && expr.left.type == 'Index' && expr.left.object.kind)){
			this.raise(expr.start, "Please use 'type[] x', not 'type x[]' for array types")
		}
		// parse float x, y to be a TypeVar not (float x), y
		if(inStatement && (
			expr.type == 'Index' && expr.object.typing ||
			expr.type == 'Id' && expr.typing || 
			expr.type == 'Assign' && expr.left.typing || 
			expr.type == 'Call' && expr.fn.typing)){
			// lets convert to something that looks like a var decl
			var node = this.startNodeFrom(expr)
			var defs = node.defs = []
			if(expr.type == 'Assign'){
				// make an init def
				node.typing = expr.left.typing
				expr.left.typing = undefined
				var def = this.startNodeFrom(expr)
				def.id = expr.left
				def.init = expr.right
				defs[0] = this.finishNode(def, "Def")
			}
			else if(expr.type == 'Call'){
				// make a call init def
				node.typing = expr.fn.typing
				expr.fn.typing = undefined
				var def = this.startNodeFrom(expr)
				def.id = expr.fn
				expr.name = undefined
				def.init = expr
				def.init.fn = node.typing
				defs[0] = this.finishNode(def, "Def")
			}
			else {
				// normal def
				node.typing = expr.typing
				expr.typing = undefined
				def = this.startNodeFrom(expr)
				def.id = expr
				defs[0] = this.finishNode(def, "Def")
			}
			if(this.tokType === this._comma){
				this.eat(this._comma)
				this.parseDefs(noIn, defs)
			}
			return this.finishNode(node, 'TypeVar')
		}

		if(this.tokType === this._comma){
			var node = this.startNodeFrom(expr)
			node.items = [expr]

			while(this.eat(this._comma)){

				if(this.tokType === this._else) break
				node.items.push(this.parseMaybeQuote(noIn, termColon))
			}
			return this.finishNode(node, "List")
		}
		return expr
	}

	this.parseNoCommaExpression = function(noIn) {
		return this.parseMaybeQuote(noIn)
	}

	// parse quoting of expressions
	this.parseMaybeQuote = function(noIn) {
		if(this.tokType == this._colon ){
			var node = this.startNode()
			this.next()
			node.quote = this.parseMaybeAssign(noIn)
			return this.finishNode(node, "Quote")
		}
		return this.parseMaybeAssign(noIn)
	}

	// Parse an assignment expression. This includes applications of
	// operators like `+=`.

	this.parseMaybeAssign = function(noIn) {
		var left = this.parseMaybeConditional(noIn)
		if (this.tokType.isAssign) {
			var node = this.startNodeFrom(left)
			if(this.probe_flag) node.store = 8

			if(this.storeComments){
				this.commentAround(node, this.tokType)
			}				
			node.op = this.tokVal
			node.left = left
			this.next()
			// lets parse shit in the middle

			node.right = this.parseMaybeQuote(noIn)
			if(node.op != '=') this.checkLVal(left)
			return this.finishNode(node, "Assign")
		}
		return left
	}

	// Parse a ternary conditional (`?:`) operator.

	this.parseMaybeConditional = function(noIn) {
		var expr = this.parseExprOps(noIn)
		if (this.eat(this._question)) {
			var node = this.startNodeFrom(expr)
			node.test = expr
			node.then = this.parseNoCommaExpression(noIn)
			this.expect(this._colon)
			node.else = this.parseNoCommaExpression(noIn)
			return this.finishNode(node, "Condition")
		}
		return expr
	}

	// Start the precedence parser.

	this.parseExprOps = function(noIn) {
		return this.parseExprOp(this.parseMaybeUnary(), -1, noIn)
	}

	// Parse binary operators with the operator precedence parsing
	// algorithm. `left` is the left-hand side of the operator.
	// `minPrec` provides context that allows the function to stop and
	// defer further parser to one of its callers when it encounters an
	// operator that has a lower precedence than the set it is parsing.

	this.parseExprOp = function(left, minPrec, noIn) {

		var prec = this.tokType.binop
		if (prec != null && !this.tokType.isAssign && 
			(!noIn || (this.tokType !== this._in && this.tokTYpe !== this._of &&  (this.tokType !== this._name || (this.tokVal !== 'to' && this.tokVal !== 'from'))))) {
			if (prec > minPrec) {
 				var node = this.startNodeFrom(left)
				if(this.probe_flag) node.store = 8
				// ok lets annotate newlines/comments
				// allright this is the only point we can annotate comments/newlines 

				// ok so. either we are object, 1
				// or we are 1, object
				if(this.storeComments){
					this.commentAround(node, this.tokType)
				}
				node.left = left
				node.op = this.tokType.replace || this.tokVal
				node.prio = this.tokType.binop
				var op = this.tokType.replaceOp || this.tokType
				this.next()

				node.right = this.parseExprOp(this.parseMaybeUnary(), prec, noIn)
				var exprNode = this.finishNode(node, op.logic ? "Logic" : "Binary")
				return this.parseExprOp(exprNode, minPrec, noIn)
			}
		}
		return left
	}

	// Parse unary operators, both prefix and postfix.

	this.parseMaybeUnary = function() {
		if (this.tokType.prefix) {
			var node = this.startNode(), update = this.tokType.isUpdate

			node.op = this.tokType.replace || this.tokVal
			if(this.probe_flag) node.store = 8
			node.prefix = true
			this.tokRegexpAllowed = true
			this.next()
			node.arg = this.parseMaybeUnary()
			if (update) this.checkLVal(node.arg)
			else if (this.strict && node.op === "delete" &&
							 node.arg.type === "Id")
				this.raise(node.start, "Deleting local variable in this.strict mode")
			return this.finishNode(node, update ? "Update" : "Unary")
		}
		var expr = this.parseExprSubscripts()
		while (this.tokType.postfix && !this.canInsertSemicolon()) {
			var node = this.startNodeFrom(expr)
			node.op = this.tokVal
			node.prefix = false
			node.arg = expr
			this.checkLVal(expr)
			this.next()
			expr = this.finishNode(node, "Update")
		}
		return expr
	}

	// Parse call, dot, and `[]`-subscript expressions.

	this.parseExprSubscripts = function() {
		var probe = this.probe_flag
		var atom = this.parseExprAtom()
		if(probe) atom.store = atom.store || 0, atom.store |= 8
		return this.parseSubscripts(atom)
	}

	this.bench = {}

	this.parseSubscripts = function(base, noCalls) {

		switch(this.tokType){
		case this._bracketL:
			// we also dont do this._bracketL on new line
			if( this.lastSkippedNewlines ) return base
			var probe = this.probe_flag
			this.eat(this._bracketL)
			var node = this.startNodeFrom(base)
			if(probe) node.store = 8
			node.object = base
			if( this.tokType != this._bracketR){
				node.index = this.parseExpression()
			}
			this.expect(this._bracketR)
			return this.parseSubscripts(this.finishNode(node, "Index"), noCalls)

		case this._dot:
			var probe = this.probe_flag

			var node = this.startNodeFrom(base)

			this.commentAround(node, this._dot)

			this.eat(this._dot)

			probe = probe || this.probe_flag

			if(probe) node.store = 8
			node.object = base
			node.key = this.parseIdent(true)
			return this.parseSubscripts(this.finishNode(node, "Key"), noCalls)
		
		case this._bracketR:
		case this._multiplyModulo:
		case this._parenR:
		case this._comma:
			return base
		
		case this._parenL:
			if(noCalls) return base
			return this.parseCall( base )

		case this._existkey:
			this.eat(this._existkey)
			var node = this.startNodeFrom(base)
			node.object = base
			if(this.isExistStore){
				base.store = 1
			}
			node.key = this.parseIdent(true)
			node.exist = 1
			return this.parseSubscripts(this.finishNode(node, "Key"), noCalls)
		case this._this:
		case this._string:
		case this._name:
			if( this.lastSkippedNewlines ) return base

			if(base.type !== 'This' && base.type !== 'Id' && base.type !== 'Index' && base.type !== 'Key')
				return base
			//if(base.typing) this.raise(base.start, "Chaining multiple types has no purpose(yet)")
			var node = this.startNodeFrom(base)
			node.typing = base
			node.name = this.tokVal
			this.eat(this._name) || this.eat(this._string) || this.eat(this._this) 

			return this.parseSubscripts(this.finishNode(node, "Id"))

		case this._dotdot:
			if( this.lastSkippedNewlines ) return base
			this.eat(this._dotdot)
			base.store = base.store || 0
			base.store |= 1
			if( this.lastSkippedNewlines ) return base
			if( this.tokType === this._name || this.tokType.keyword){
				var node = this.startNodeFrom(base)
				node.object = base
				node.key = this.parseIdent(true)
				return this.parseSubscripts(this.finishNode(node, "Key"), noCalls)
			}
			return this.parseSubscripts(base, noCalls)

		case this._notxor:
			if( this.lastSkippedNewlines ) return base
			if(this.tokVal == '!') base.store |= 2
			else base.store |= 4
			this.eat(this._notxor)
			base.store = base.store || 0
			return base


		case this._doublecolon:
			this.eat(this._doublecolon)
			var node = this.startNodeFrom(base)
			node.object = base
			node.key = this.parseIdent(true)
			return this.parseSubscripts(this.finishNode(node, "ThisCall"), noCalls)
		
		case this._braceL:
			// we also dont do this._braceL on new line
			if( noCalls || this.lastSkippedNewlines ) return base
			
			// we have to figure out if we are a Function or not.
			// if base has parens, we are a short arrow funciton
			if(base.parens || base.type == 'Call'){
				var node = this.startNodeFrom(base)
				//node.arrow = '->'
				return this.parseArrowFunction(node, base)
			} 
			else {
				var node = this.startNodeFrom(base)
				node.fn = base
				//node.arrow = '->'
				node.body = this.parseBlock(true)
				return this.parseSubscripts(this.finishNode(node, "Nest"), noCalls)
			}
		case this._thinArrow:
		case this._fatArrow:
			// you cant separate an arrow from its args with a this.newline
			if( this.lastSkippedNewlines ) return base
			var node = this.startNodeFrom(base)
			node.arrow = this.tokType.type
			this.next()
			return this.parseArrowFunction(node, base)
		case this._on:
		case this._do:
			// do on next line followed by { } is interpreted as the JS do/while
			if( this.lastSkippedNewlines && this.input.charCodeAt(this.tokPos) == 123)return base

			var type = this.tokType
			var node = base
			if(base.type !== 'Call'){
				node = this.startNodeFrom(base)
				node.fn = base
				node.args = []
			}

			// lets modify base into a call.
			node.extarg = this.tokVal
			this.next()
			var arg = this.parseNoCommaExpression()
	
			if(type == this._do){
				node.args.push(arg)
			}
			else
				node.args.unshift(arg)

			// we can parse other _do's or catch's
			if(this.eat(this._catch)){
				node.args.push(this.parseNoCommaExpression())
			}

			if(this.tokType == this._name && this.tokVal == 'then'){
				node = this.finishNode(node, 'Call')
				var ident = this.parseIdent()
				if(this.tokType == this._parenL){
					this.eat(this._parenL)
					this.expect(this._parenR)
				}
				node.then = this.parseSubscripts(ident, noCalls)
				return node
				//eat(this._ident)
			}
			return this.finishNode( node, 'Call')
		/*
		case this._on:
		case this._do:
			// do on next line followed by { } is interpreted as the JS do/while
			if( this.lastSkippedNewlines && this.input.charCodeAt(this.tokPos) == 123)return base
			// if we are a catch, we must scan up to
			// the last do
			var node = this.startNodeFrom(base)
			
			// lets modify base into a call.


			node.call = base
			node.kind = this.tokVal
			this.next()
			node.arg = this.parseNoCommaExpression()
			// we can parse other _do's or catch's
			if(this.eat(this._catch)){
				node.catch = this.parseNoCommaExpression()
			}

			if(this.tokType == this._name && this.tokVal == 'then'){
				node = this.finishNode( node, 'Do')
				var ident = this.parseIdent()
				if(this.tokType == this._parenL){
					this.eat(this._parenL)
					this.expect(this._parenR)
				}
				node.then = this.parseSubscripts(ident, noCalls)
				return node
				//eat(this._ident)
			}
			return this.finishNode( node, 'Do')
			*/
		} 
		return base
	}

	this.parseCall = function(base){
		if( this.lastSkippedNewlines ) return base
		var probe = this.probe_flag
		this.eat(this._parenL)
		var node = this.startNodeFrom(base)
		if(probe) node.store = 8
		node.fn = base
		node.args = this.parseExprList(this._parenR, false)
		return this.parseSubscripts(this.finishNode(node, "Call"))
	}

	// Parse an atomic expression — either a single token that is an
	// expression, an expression started by a keyword like `function` or
	// `new`, or an expression wrapped in punctuation like `()`, `[]`,
	// or `{}`.

	this.parseExprAtom = function() {
	
		switch (this.tokType) {
		case this._this:
			var node = this.startNode()
			this.next()
			return this.finishNode(node, "This")
		case this._new:
			return this.parseNew()
		case this._name:
			var typing = this.parseIdent()
			if(!this.lastSkippedNewlines && this.tokType == this._name){
				var node = this.parseIdent()
				node.typing = typing
				return node
			}
			return typing
		case this._num: 
			var node = this.startNode()
			node.kind = "num"
			node.value = this.tokVal
			node.raw = this.input.slice(this.tokStart, this.tokEnd)
			this.next()
			return this.finishNode(node, "Value")
		case this._template:
			var node = this.startNode()
			node.chain = []
			// what this should do is call
			while(1){
				var item = this.startNode()
				item.kind = "string"
				item.value = this.tokVal
				item.multi = this.isMultiLine
				node.chain.push(item)
				var tokType = this.tokType
				this.next()
				this.finishNode(item, "Value")
				if(tokType == this._string) break
				node.chain.push(this.parseBlock())
			}
			return this.finishNode(node,"Template")
		case this._string: 
			var node = this.startNode()
			node.kind = "string"
			node.value = this.tokVal
			node.multi = this.isMultiLine
			node.raw = this.input.slice(this.tokStart, this.tokEnd)
			this.next()
			// we should emit a this._stringInterp
			// and keep a stack for the tokenizer

			// how are we going to do string interpolation?
			return this.finishNode(node, "Value")
		case this._regexp:
			var node = this.startNode()
			node.kind = "regexp"
			node.value = this.regexContent
			node.multi = this.isMultiLine
			node.raw = this.input.slice(this.tokStart, this.tokEnd)
			this.next()
			return this.finishNode(node, "Value")

		case this._null: case this._true: case this._false:
			var node = this.startNode()
			node.value = this.tokType.atomValue
			node.raw = this.tokType.keyword
			this.next()
			return this.finishNode(node, "Value")

		case this._parenL:
			var tokStart1 = this.tokStart
			this.next()

			if( this.tokType == this._parenR){// this.empty parens
				this.eat(this._parenR)

				if( this.tokType !== this._thinArrow && 
					this.tokType !== this._fatArrow  && 
					this.tokType !== this._braceL) this.unexpected()
				var val = this.startNode()
				val.start = tokStart1
				val.parens = 1
				return this.parseSubscripts(this.finishNode(val, "Empty" ))
			}

			var val = this.parseExpression()
			val.start = tokStart1
			val.end = this.tokEnd
			val.parens = 1
			this.expect(this._parenR)

			return val

		case this._bracketL:
			return this.parseArray()

		case this._braceL:
			return this.parseObj()

		case this._function:
			var node = this.startNode()
			this.next()
			return this.parseFunction(node, false)

		case this._yield:
			var node = this.startNode()
			this.next()
			node.arg = this.parseExpression()
			return this.finishNode(node, "Yield")

		case this._await:
			var node = this.startNode()
			this.next()
			node.arg = this.parseExpression()
			return this.finishNode(node, "Await")

		case this._thinArrow:
		case this._fatArrow:
			var node = this.startNode()
			node.arrow = this.tokType.type
			this.next()
			return this.parseArrowFunction(node)
		case this._tripledot:
			var node = this.startNode()
			this.next()
			if(this.tokType == this._name || this.tokType.keyword){
				node.id = this.parseIdent(true)
			}
			return this.finishNode(node, "Rest")
		//case this._dot: // a flagged identifier
		//	var node = this.startNode()
		//	this.next()
		//	node.name = this.parseIdent(true)
		//	node.flag = 46
		//	return this.finishNode(node, "Id")
		case this._dotdot:
			var base = this.startNode()
			base.name = ''
			base.flag = -1
			this.finishNode(base, "Id")
			this.next()
			if( this.lastSkippedNewlines ) return base 
			if( this.tokType == this._name || this.tokType.keyword){
				var node = this.startNodeFrom(base)
				node.object = base
				node.key = this.parseIdent(true)
				return this.parseSubscripts(this.finishNode(node, "Key"))
			} 
			return this.parseSubscripts(base)
		//case this._doublecolon:
		//	return this.parseExtends()
		default:
			this.unexpected()
		}
	}

	// New's precedence is slightly tricky. It must allow its argument
	// to be a `[]` or dot subscript expression, but not a call — at
	// least, not without wrapping it in parentheses. Thus, it uses the

	this.parseNew = function() {
		var node = this.startNode()
		this.next()
		node.fn = this.parseSubscripts(this.parseExprAtom(), true)
		if (this.eat(this._parenL)) node.args = this.parseExprList(this._parenR, false)
		else node.args = this.empty
		return this.finishNode(node, "New")
	}

	// parseArray
	this.parseArray = function(){
		var node = this.startNode()

		if(this.storeComments) this.commentHead(node)
		this.next()
		if(this.tokType == this._for){
			this.next()
			var nfor = this.startNode()
			nfor.compr = true
			node.for = this.parseAllFor(nfor, true)
			this.eat(this._bracketR)
			return this.finishNode(node, 'Comprehension')
		}
		node.elems = this.parseExprList(this._bracketR, true, true)
		if(this.storeComments) this.commentTail(node, this._bracketR)
		return this.finishNode(node, "Array")
	}

	// Parse an object literal.
	this.parseObj = function() {
		var node = this.startNode(), first = true, sawGetSet = false
		node.keys = []

		if(this.storeComments) this.commentHead(node)

		this.next()
		while (!this.eat(this._braceR)) {

			if(this.storeComments) var cmt = this.commentBegin()

			if (!first) {
				this.canInjectComma( this.tokType ) || this.expect(this._comma)
				if (this.allowTrailingCommas && this.eat(this._braceR)) break
			} else first = false

			var prop = {key: this.parsePropertyName()}, isGetSet = false, kind
			
			if (this.eat(this._colon)) {
				prop.value = this.parseNoCommaExpression()
				kind = prop.kind = "init"
			} else if (this.ecmaVersion >= 5 && prop.key.type === "Id" &&
								 (prop.key.name === "get" || prop.key.name === "set")) {
				isGetSet = sawGetSet = true
				kind = prop.kind = prop.key.name
				prop.key = this.parsePropertyName()
				if (this.tokType !== this._parenL) this.unexpected()
				prop.value = this.parseFunction(this.startNode(), false)
			} else {
				if( this.tokType != this._braceR && this.tokType != this._comma && !this.canInjectComma( this.tokType ))
					this.unexpected()
				// we are a shorthand initialized value
				prop.short = 1
			}
			// getters and setters are not allowed to clash — either with
			// each other or with an init property — and in this.strict mode,
			// init properties are also not allowed to be repeated.

			if (prop.key.type === "Id" && (this.strict || sawGetSet)) {
				for (var i = 0; i < node.keys.length; ++i) {
					var other = node.keys[i]
					if (other.key.name === prop.key.name) {
						var conflict = kind == other.kind || isGetSet && other.kind === "init" ||
							kind === "init" && (other.kind === "get" || other.kind === "set")
						if (conflict && !this.strict && kind === "init" && other.kind === "init") conflict = false
						if (conflict) this.raise(prop.key.start, "Redefinition of property")
					}
				}
			}
			if(this.storeComments) this.commentEnd(prop, cmt, this._braceR)
			node.keys.push(prop)
		}
		if(this.storeComments) this.commentTail(node, this._braceR)
		return this.finishNode(node, "Object")
	}

	this.parsePropertyName = function() {
		if (this.tokType === this._num || this.tokType === this._string) return this.parseExprAtom()
		return this.parseIdent(true)
	}

	// Parse a function declaration or literal (depending on the
	// `isStatement` parameter).
	
	this.argToDef = function( node ) {
		var o = this.startNodeFrom(node)
		o.end = node.end
		o.type = 'Def'

		if( node.type === 'Id' || node.type === 'Array' || node.type === 'Object'){
			o.id = node
		} else if( node.type === 'Assign' && node.op === '='){
			o.id = node.left
			o.init = node.right
		} else this.raise(node.start, "Invalid function argument definition")
		return o
	}

	this.parseArrowFunction = function(node, args) {
		if(args){
			// convert args to a List of Defs
			if( args.type === 'Empty' ){
				node.params = []
			}else 
			if( args.type === 'List' || args.type === 'Call'){
				var items
				if(args.type == 'Call'){
					node.name = args.fn
					items = args.args
				}
				else if(args.type == 'List') items = args.items

				for( var i = 0, l = items.length; i < l; i++){
					if( items[ i ].type == 'Rest'){
						if( i < l - 1) this.raise(items[i].start, "Cannot use rest prefix befor last parameter")
						node.rest = items[ i ]
						items.length --
					} else items[ i ] = this.argToDef( items[ i ] )
				}
				node.params = items
			} else {
				if( args.type == 'Rest'){
					node.rest = args
				}
				else node.params = [this.argToDef( args )]
			} 
		} 
		if(this.tokType == this._braceL) node.body = this.parseBlock(true)
		else  node.body = this.parseNoCommaExpression()

		return this.finishNode(node, 'Function')
	}

	// Parse a function declaration or literal (depending on the
	// `isStatement` parameter).

	this.parseFunction = function(node, isStatement) {
		if( this.tokType === this._multiplyModulo){
			node.gen = 1
			this.next()
		}
		if (this.tokType === this._name) node.id = this.parseIdent()
		else node.id = null

		this.expect(this._parenL)
		node.params = this.parseDefs( false, undefined, true )

		if(this.tokType == this._dot) node.rest = this.parseDots(true)

		this.expect(this._parenR)

		// Start a new scope with regard to this.labels and the `this.inFunction`
		// flag (restore them to their old value afterwards).
		var oldInFunc = this.inFunction, oldLabels = this.labels
		this.inFunction = true; this.labels = []
		node.body = this.parseBlock(true)
		this.inFunction = oldInFunc; this.labels = oldLabels

		// If this is a this.strict mode function, verify that argument names
		// are not repeated, and it does not try to bind the words `eval`
		// or `arguments`.
		if (this.strict || node.body.steps.length && this.isUseStrict(node.body.steps[0])) {
			for (var i = node.id ? -1 : 0; i < node.args.length; ++i) {
				var id = i < 0 ? node.id : node.args[i]
				if (this.isStrictReservedWord(id.name) || this.isStrictBadIdWord(id.name))
					this.raise(id.start, "Defining '" + id.name + "' in this.strict mode")
				if (i >= 0) for (var j = 0; j < i; ++j) if (id.name === node.args[j].name)
					this.raise(id.start, "Argument name clash in this.strict mode")
			}
		}
		node.def = isStatement && node.id !== undefined

		return this.finishNode(node, "Function")
	}

	// Parses a comma-separated list of expressions, and returns them as
	// an array. `close` is the token type that ends the list, and
	// `allowEmpty` can be turned on to allow subsequent commas with
	// nothing in between them to be parsed as `null` (which is needed
	// for array literals).

	this.parseExprList = function(close, allowTrailingComma, allowEmpty) {
		var elts = [], first = true
		while (!this.eat(close)) {
			if(this.storeComments){
				var cmt = this.commentBegin()
			}
			if (!first) {
				this.canInjectComma( this.tokType ) || this.expect(this._comma)
				if (allowTrailingComma && this.allowTrailingCommas && this.eat(close)) break
			} else first = false
			if (allowEmpty && this.tokType === this._comma) elts.push(null)
			else{
				var sub = this.parseNoCommaExpression()
				elts.push(sub)
				this.commentEnd(sub, cmt, close)
			}
		}
		return elts
	}

	// Parse the next token as an identifier. If `liberal` is true (used
	// when parsing properties), it will also convert keywords into
	// identifiers.

	this.parseIdent = function(liberal) {
		var node = this.startNode()
		if(this.tokIsType) node.isType = this.tokVal
		if (liberal && this.forbidReserved == "everywhere") liberal = false
		
		/*if((this.tokType == this._delete || this.tokType == this._new) && 
			!this.isIdentifierStart(this.input.charCodeAt(this.tokPos)))
			this.tokType = this._name*/

		if (this.tokType === this._name) {
			if (!liberal &&
					(this.forbidReserved &&
					 (this.ecmaVersion === 3 ? this.isReservedWord3 : this.isReservedWord5)(this.tokVal) ||
					 this.strict && this.isStrictReservedWord(this.tokVal)) &&
					this.input.slice(this.tokStart, this.tokEnd).indexOf("\\") == -1)
				this.raise(this.tokStart, "The keyword '" + this.tokVal + "' is reserved")
			node.name = this.tokVal
		} else if (liberal && this.tokType.keyword) {
			node.name = this.tokType.keyword
		} else {
			this.unexpected()
		}
		this.tokRegexpAllowed = false
		if( this.containsFlag ){
			node.flag = this.containsFlag
		}
		this.next()
		return this.finishNode(node, "Id")
	}
})