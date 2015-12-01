/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	this.space = ' '
	this.newline = '\n'
	this.indent = '\t'
	this.line = 0
	this.comma = ',' + this.space
	this.term = ';'

	this.expand = function(node, parent, state){ // recursive expansion
		if(!state) throw new Error('Please pass in state {depth:""}')
		if(!node || !node.type) return ''

		node.parent = parent
		node.infer = undefined

		if(!this[node.type]) throw new Error('Undefined type in OneJSGen:' + node.type)

		var ret = this[node.type](node, parent, state)

		// lets pass the inference up
		if(node.infer && parent && !parent.infer) parent.infer = node.infer

		if(node.store){
			if(node.store & 1) ret = ret + '..'
			if(node.store & 2) ret = ret + '!'
			if(node.store & 4) ret = ret + '~'
		}

		if(state.trace){
			var out = state.depth + node.type + ''
			if(node.type === "Call") out += " fn:" +node.fn.name
			if(node.type == "Id") out += ' name:' + node.name
			if(node.type == "Value") out += ' value:' + node.value
			console.log(out)
		}

		return ret
	}

	this.block = function(array, parent, state, noindent){ // term split array
		state = Object.create(state)
		if(!noindent) state.depth += this.indent

		var ret = ''
		for(var i = 0; i < array.length; i++){
			var node = array[ i ]
			var blk = this.expand(node, parent, state)

			if(blk === undefined) throw new Error('ast node ' + node.type + ' returned undefined in block')

			if(blk[0] == '(' || blk[0] == '[') ret += state.depth + ';' + blk
			else ret += state.depth + blk

			if(this.term) ret += this.term

			if(ret[ret.length - 1] !== '\n' ) ret += this.newline, this.line++
		}
		return ret
	}

	this.flat = function(array, parent, state){
		var ret = ''
		for(var i = 0; i < array.length; i++){
			if(i) ret += this.comma
			ret += this.expand(array[i], parent, state)
		}
		return ret
	}

	this.list = function(array, parent, state){
		var ret = ''
		for(var i = 0; i < array.length; i++){
			if(ret !== '') ret += this.comma
			ret += this.expand(array[i], parent, state)
			if(ret[ret.length - 1] == '\n'){
				ret += state.depth
				if(i !== len - 1) ret += this.indent
			}
		}
		return ret
	}

	this.needsParens = function(node, other, isleft){
		var other_t = other.type

		if(other_t == 'Assign' || other_t == 'List' || other_t == 'Condition' || 
			(other_t == 'Binary' || other_t == 'Logic') && other.prio <= node.prio){
			if(other.prio == node.prio && isleft) return false
			return true
		}
	}

	this.Program = function(node, parent, state){ 
		return this.block(node.steps, node, state, true)
	}

	this.Empty = function(node, parent, state){
		return ''
	}

	this.Id = function(node, parent, state){
		var flag = node.flag
		if(flag){
			if(flag === -1) return '..'
			if(flag === 46) return '.' + node.name
			if(flag === 126) return node.name + '~'
			if(flag === 33) return node.name + '!'
			if(flag === 64) return '@' + (node.name!==undefined?node.name:'')
			if(flag === 35) return '#' + (node.name!==undefined?node.name:'')
		}
		if(node.typing) return this.expand(node.typing, node, state) + ' ' + node.name
		return node.name
	}

	this.Define = function(node, parent, state){ throw new Error('depricated') }

	this.Value = function(node, parent, state){
		return node.raw 
	}
	 // string, number, bool
	this.This = function(node, parent, state){
		return 'this'
	}

	this.Array = function(node, parent, state){
		var ret = '[' +
			this.list(node.elems, node, state) +
		']'
		return ret
	}

	this.Object = function(node, parent, state){ 

		var nstate = Object.create(state)
		nstate.depth += this.indent

		var keys = node.keys
		var len = k.length
		var ret = '{' + this.space

		for(var i = 0; i < len; i++){
			var prop = keys[i]
			if(i) ret += ',' + this.space
			
			var ch = ret[ret.length -1]
			if(ch == '\n') ret += nstate.depth
			else if(ch == '}') ret +=  this.newline + nstate.depth
			
			ret += prop.key.name || prop.key.raw

			if(prop.short === undefined){
				ret += ':' + this.expand(prop.value, node, nstate)
			}
		}

		var ch = ret[ ret.length - 1 ]
		if( ch == '\n') ret += state.depth +'}'
		else{
			if( ch == '}' ) ret += this.newline + state.depth + '}'
			else ret += this.space + '}'
		}

		return ret
	}

	this.Index = function(node, parent, state){
		var obj = node.object
		var object_t = obj.type
		var object = this.expand(obj, node, state)

		if(object_t !== 'Index' && object_t !== 'Id' && object_t !== 'Key' && object_t !== 'Call' && object_t !== 'This' && object_t !== 'ThisCall')
			object = '(' + object + ')'

		return object + '[' + this.expand(node.index, node, state) + ']'
	}

	this.Key = function(node, parent, state){
		var obj = node.object
		var object_t = obj.type
		var object = this.expand(obj, node, state)
	
		if(object_t !== 'Index' && object_t !== 'Id' && object_t !== 'Key' && object_t !== 'Call'&& object_t !== 'This' && object_t !== 'ThisCall')
			object = '(' + object + ')'

		return  object + (this.exist?'?.':'.') + this.expand(node.key, node, state)
	}

	this.ThisCall = function(node, parent, state){
		var obj = node.object
		var object_t = obj.type
		var object = this.expand(obj, node)
	
		if(object_t !== 'Index' && object_t !== 'Id' && object_t !== 'Key' && object_t !== 'Call'&& object_t !== 'This' && object_t !== 'ThisCall')
			object = '(' + object + ')'

		return  object + '::' + this.expand(node.key, node)
	}

	this.Block = function(node, parent, state){
		var ret = '{' + this.newline + this.block(node.steps, node, state) + state.depth + '}'
		return ret
	}

	this.List = function(node, parent, state){
		return this.list(node.items, node, state)
	}

	this.Comprehension = function(node, parent, state){
		return '1'
	}

	this.Template = function(node, parent, state){
		var ret = '`'
		var chain = node.chain
		var len = chain.length 
		for(var i = 0; i < len; i++){
			var item = chain[i]
			if(item.type == 'Block'){
				if(item.steps.length == 1 && outer.IsExpr[item.steps[0].type]){
					ret += '{' + this.expand(item.steps[0], node, state) + '}'
				} 
				else ret += this.expand(item, node, state)
			}
			else {
				if(item.value !== undefined) ret += item.value
			}
		}
		ret += '`'
		return ret
	}

	this.Break = function(node, parent, state){
		return 'break' + (node.label? ' ' + this.expand(node.label, node, state): '')
	}

	this.Continue = function(node, parent, state){
		return 'continue'+(node.label?' '+this.expand(node.label, node, state): '')
	}

	this.Label = function(node, parent, state){
		return this.expand(node.label, node, state) + ':' + this.expand(node.body, node, state)
	}

	this.If = function(node, parent, state){
		var ret = 'if('
		ret += this.expand(node.test, node, state)

		if(ret[ret.length - 1] == '\n') ret += state.depth + this.indent
		ret += ')' + this.space + this.expand(node.then, node, state) 

		if(node.else){
			var ch = ret[ret.length - 1]
			if( ch !== '}' && this.term) ret += this.term
			if( ch !== '\n' ) ret += this.newline
			ret += state.depth + 'else ' + this.expand(node.else, node, state)
		}

		return ret
	}

	this.Switch = function(node, parent, state){
		var ret = 'switch(' + this.expand(node.on, node, state) + '){'
		ret += this.newline

		var nstate = Object.create(state)
		nstate.depth += this.indent				

		var cases = node.cases
		if(cases) for( var i = 0; i < cases.length; i++ ) ret += nstate.depth + this.expand(cases[i], node, nstate)

		ret += state.depth + '}'

		return ret
	}

	this.Case = function(node, parent, state){
		if(!node.test){
			return 'default:' + (node.steps.length? this.newline+this.block(node.steps, node, state): this.newline)
		}
		var ret = 'case '

		ret += this.expand(node.test, node) + ':' 
		ret += this.newline

		if(node.steps.length) ret += this.block(node.steps, node)

		return ret
	}

	this.Throw = function(node, parent, state){
		return 'throw ' + this.expand(node.arg, node)
	}

	this.Try = function(node, parent, state){
		var ret = 'try' + this.expand(node.try, node)
		if(node.catch){
			if(node.arg.type !== 'Id') throw new Error("unsupported catch type")
			var name = node.arg.name 
			ret += 'catch(' + name + ')' + this.expand(node.catch, node, state)
		} 

		if(node.finally) ret += 'finally' + this.expand(node.finally, node, state)
		return ret
	}

	this.While = function(node, parent, state){
		return 'while(' + this.expand(node.test, node, state) + ')' + 
			this.expand(node.loop, node, state)
	}

	this.DoWhile = function(node, parent, state){
		return 'do' + this.expand(node.loop, node, state) + 
			'while(' + this.expand(node.test, node, state) + ')'
	}

	this.For = function(node, parent, state){
		return 'for(' + this.expand(node.init, node, state)+';'+
				this.expand(node.test, node, state) + ';' +
				this.expand(node.update, node, state) + ')' + 
				this.expand(node.loop, node, state)
	}

	this.ForIn = function(node, parent, state){
		return 'for(' + this.expand(node.left, node, state) + ' in ' +
			this.expand(node.right, node, state) + ')' + 
			this.expand(node.loop, node, state)
	}

	this.ForOf = function(node, parent, state){

		return 'for(' + this.expand(node.left, node, state) + ' of ' +
			this.expand(node.right, node, state) + ')' + 
			this.expand(node.loop, node, state)
	}

	this.ForFrom = function(node, parent, state){
		return 'for(' + this.expand(node.left, node, state) + ' from ' +
			this.expand(node.right, node, state) + ')' + 
			this.expand(node.loop, node, state)
	}

	this.ForTo = function(node, parent, state){
		return 'for(' + this.expand(node.left, node, state) + ' to ' +
			this.expand(node.right, node, state) + 
			(node.in?' in ' + this.expand(node.in, node, state):'') + ')' + 
			this.expand(node.loop, node, state)
	}

	this.Var = function(node, parent, state){
		return 'var ' + this.flat(node.defs, node, state)
	}

	this.TypeVar = function(node, parent, state){
		return this.expand(node.typing, node, state) + ' ' + 
			this.flat(node.defs, node, state)
	}

	this.Def = function(node, parent, state){
		return this.expand(node.id, node, state) + 
			(node.init ? this.space + '=' + this.space + this.expand(node.init, node, state) : '')
	}

	this.Struct = function(node, parent, state){
		return 'struct ' + this.expand(node.id, node, state) + this.expand(node.struct, node, state)
	}

	this.Enum = function(node, parent, state){
		return 'enum ' + this.expand(node.id, node) + '{' + this.newline + 
			state.depth + this.indent + this.list(node.enums, node, state) +'}'
	}

	this.Function = function(node, parent, state){
		if(node.arrow){
			var arrow = node.arrow
			// if an arrow has just one Id as arg leave off ( )
			if( !node.name && !node.rest && node.params && node.params.length == 1 && !node.params[0].init && node.params[0].id.type == 'Id' ){
				return this.expand(node.params[0].id, node, state) + arrow + this.expand(node.body, node, state)
			}
			var ret = ''
			if(node.name) ret += this.expand(node.name, node, state)

			ret += '(' +(node.params?this.list(node.params, node, state):'') + 
				(node.rest ? ',' + this.space + this.expand(node.rest, node, state) : '' )+ ')' 
			if(!node.name || node.body.type != 'Block' || arrow != '->') ret += arrow
			ret += this.expand(node.body, node)
			this.cignore = 1
			return ret
		}
		var ret 
		if(node.name) ret = this.expand(node.name)
		else ret = 'function'
		if( node.gen ) ret += '*'
		if( node.id ) ret += ' '+this.expand(node.id, node, state)
		ret += '('+this.list(node.params, node, state)
		if( node.rest ) ret += ',' + this.expand(node.rest, node, state) 
		ret += ')'
		ret += this.expand(node.body, node, state)
		return ret
	}

	this.Return = function(node, parent, state){
		if(!node.arg) return 'return'
		return 'return ' + this.expand(node.arg, node, state)
	}

	this.Yield = function(node, parent, state){
		if(!node.arg) return 'yield'
		return 'yield ' + this.expand(node.arg, node, state)
	}

	this.Await = function(node, parent, state){
		if(!node.arg) return 'await'
		return 'await ' + this.expand(node.arg, node, state)
	}

	this.Unary = function(node, parent, state){
		var arg = this.expand(node.arg, node, state)
		var atype = node.arg.type

		if(node.prefix){
			if(atype == 'Assign' || atype == 'Binary' ||
				atype == 'Logic' || atype == 'Condition')
				arg = '(' + arg + ')'

			if(node.op.length != 1) return node.op + ' ' + arg

			return node.op + arg
		}
		return arg + node.op
	}

	// alright so how are we going to do parens?
	this.Binary = function(node, parent, state){
		var left = this.expand(node.left, node, state)
		var right = this.expand(node.right, node, state)

		if(this.needsParens(node, node.left)) left = '(' + left + ')'
		if(this.needsParens(node, node.right)) right = '(' + right + ')' 

		return left + this.space + node.op + this.space + right
	}

	this.Logic = function(node, parent, state){
		var left = this.expand(node.left, node, state)
		var right = this.expand(node.right, node, state)

		if(this.needsParens(node, node.left)) left = '(' + left + ')'
		if(this.needsParens(node, node.right)) right = '(' + right + ')' 

		return left + this.space + node.op + this.space + right
	}

	this.Assign = function(node, parent, state){
		var left = this.expand(node.left, node, state)
		var right = this.expand(node.right, node, state)
		return left + this.space + node.op + this.space + right
	}

	this.Update = function(node, parent, state){
		if(node.prefix) return node.op + this.expand(node.arg, node, state)
		return this.expand(node.arg, node, state) + node.op
	}

	this.Condition = function(node, parent, state){
		// if we have a test of logic or binary 
		var test = this.expand(node.test, node, state)
		var test_t = node.test.type

		if(test_t == 'Assign' || test_t == 'List' || 
			test_t == 'Logic' || test_t == 'Binary') test = '(' + test + ')'

		var else_v = this.expand(node.else, node, state)
		var else_t = node.else.type
		if(else_t == 'Assign' || else_t == 'List' || 
			else_t == 'Logic' || else_t == 'Binary') else_v = '(' + else_v + ')'

		return test + '?' + 
			this.space + this.expand(node.then, node, state) + ':' + 
			this.space + else_v
	}

	this.New = function(node, parent, state){
		var fn = this.expand(node.fn, node, state)
		var fn_t = node.fn.type
		if(fn_t == 'List' || fn_t == 'Logic' || fn_t == 'Condition') 
			fn = '(' + fn + ')'
		return 'new ' + fn + '(' + this.list(node.args, node, state) + ')'
	}

	this.callArgs = function(node, parent, state){
		var arg = ''
		if(node.first_args) arg += this.list(node.first_args, node, state)
		if(node.args && node.args.length){
			if(arg) arg += ', '
			arg += this.list(node.args, node, state)
		}
		if(node.last_args){
			if(arg) arg += ', '
			arg += this.list(node.last_args, node, state)
		}
		return arg
	}

	this.Call = function(node, parent, state){
		var fn = this.expand(node.fn, node, state)
		var fn_t = node.fn.type
		if(fn_t == 'Function' || fn_t == 'List' || fn_t == 'Logic' || fn_t == 'Condition') 
			fn = '(' + fn + ')'

		return fn + '(' + this.callArgs(node, parent, state) + ')'
	}

	this.Nest = function(node, parent, state){
		return this.expand(node.fn, node, state) + this.expand(node.body, node, state)
	}

	this.Class = function(node, parent, state){
		var ret = 'class ' + node.id.name
		if(node.base) ret += ' extends ' + node.base.name 
		ret += this.expand(node.body, node, state)
		return ret
	}

	this.Quote = function(node, parent, state){
		var ret = ':' + this.expand(node.quote, node, state)
		return ret
	}

	this.Signal = function(node, parent, state){
		var left = this.expand(node.left, node, state)
		var right = this.expand(node.right, node, state)
		return left + ':=' + this.space + quote
	}

	this.AssignQuote = function(node, parent, state){
		var left = this.expand(node.left, node, state)
		var quote = this.expand(node.quote, node, state)
		return left + ':' + this.space + quote
	}
	
	this.Rest = function(node, parent, state){
		return '...' + this.expand(node.id, node, state)
	}

	this.CallBlock = function(node, parent, state){
		return this.expand(node.object, node, state) + this.expand(node.body, node, state)
	}

	this.Debugger = function(node, parent, state){
		return 'debugger'
	}

	this.With = function(node, parent, state){
		return 'with(' + this.expand(node.object, node, state) + ')' + this.expand(node.body, node, state)
	}
})