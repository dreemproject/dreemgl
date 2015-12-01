/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$system/parse/onejsgen', function(require, exports, baseclass){

	var gltypes = require('./gltypes')
	var OneJSParser =  require('$system/parse/onejsparser')
	var OneJSGen = require('$system/parse/onejsgen.js')
	var Texture = require('$system/platform/$platform/texture$platform')
	var vectorParser = require('$system/parse/vectorparser')
	var onejsparser = new OneJSParser()
	onejsparser.parser_cache = {}

	this.newState = function(context, varyings, uniforms){
		return {
			depth: '', 
			basename: '',
			stack: 0, 
			context: context, 
			attributes: {}, 
			reference_is_attr: {},
			varyings: varyings || {},
			uniforms: uniforms || {},
			structs: [],
			scope: {},
			fnorder: [],
			functions: {},
			astcache: {},
			textures: {},
			call:{deps:{}},
			debug:{},
			dump:{}
		}
	}

	// returns a gl type
	this.getType = function(infer, state){
		// OK so, mesh doesnt get typed here but in glshader
		if(infer.fn_t === 'attribute') infer = infer.array.struct
		return gltypes.getType(infer)
	}

	this.resolveContext = function(node, context, name, basename, state){
		// compute output name
		var outname
		if(basename) outname = basename + "_DOT_" + name
		else outname = name

		// uniform
		if(name === 'super'){
			node.infer = {fn_t:'object', object:Object.getPrototypeOf(context)}
			return name
		}

		var attr_name = '_' + name
		var obj
		if(attr_name in context){ // its an attribute reference
			obj = context[attr_name]
			state.reference_is_attr[outname] = 1
		}
		else{
			obj = context[name]
		}
		
		if(typeof obj === 'number'){
			state.uniforms[outname] = node.infer = float32
			return outname
		}
		// uniform
		if(typeof obj === 'boolean'){
			node.infer = state.uniforms[outname] = bool
			return outname
		}
		// we are a custom type
		if(typeof obj === 'function' && obj.struct){
			state.structs[name] = obj
			node.infer = {
				fn_t:'constructor',
				ret: obj
			}
			return outname
		}
		// attribute
		if(obj && typeof obj === 'object' && obj.struct){
			// if we are an array, we are an attribute
			if(obj.isArray){
				if(obj.struct.id){
					state.attributes[outname] = obj.struct
				}
				node.infer = {
					fn_t: 'attribute',
					array: obj
				}
			}
			else{
				node.infer = state.uniforms[outname] = obj.struct
			}
			return outname
		}
		else if (typeof obj === 'object'){
			if(obj instanceof Texture.Image){
				obj = context[name] = Texture.fromImage(obj)
			}
			node.infer = {fn_t:'object', object:obj}
			if(state.basename) return state.basename + '_DOT_' + outname
			return outname
		}
		if(typeof obj === 'string' || typeof obj === 'function'){
			var functionref = obj
			if(typeof obj === 'function'){
				if(obj.is_wired){
					state.uniforms[outname] = node.infer = float32
					return outname
				}
				
				obj = obj.__string__ || (obj.__string__ = obj.toString())

			}
			// lets parse and figure out what we are
			
			var ast = onejsparser.parse(obj).steps[0]
			// lets check what thing we have
			if(ast.type === 'Function'){
				node.infer = {fn_t:'ast', context:context, basename:basename, name:outname, ast:ast, functionref:functionref, source:obj}
				return outname
			}
			// otherwise we recur on the ast in place
			return this.expand(ast, node, state)
		}
	}

	this.This = function(node, parent, state){
		node.infer = {fn_t:'object', object:state.context}
		return state.basename
	}

	this.Id = function(node, parent, state){
		// lets resolve ourself
		var name = node.name

		var def_t = define.typemap.types[name]
		if(def_t){
			node.infer = {fn_t:'constructor', ret:def_t}
			return name
		}
		// lets check if we have a function
		var inscope = state.scope[name]
		if(inscope){
			node.infer = inscope
			return name
		}
		// lets check gl variables
		var glvar = gltypes.variables[name]
		if(glvar){
			node.infer = glvar
			return name
		}
		var glfn = gltypes.functions[name]
		if(glfn){
			node.infer = {fn_t:'builtin', ret:glfn}
			return name
		}
		// gl functions
		// resolve on context
		var res = this.resolveContext(node, state.context, name, '', state)
		if(res !== undefined) return res

		var varying = state.varyings[name]
		if(varying){
			node.infer = varying
			return name
		}
		// what if we are an id and we cant resolve ourselves,
		if(state.assignvarying){
			// lets check if our name is debug
			if(name === 'dbg'){
				if(state.debug.type) throw new Error('Please only use one debug statement')
				state.debug.type = node.infer = state.assignvarying
				return 'dbg'
			}
			if(name === 'dump'){
				//if(state.dump.type) throw new Error('Please only use one dump statement')
				state.dump.set = true//type = node.infer = state.assignvarying
				node.infer = {fn_t:'dump'}
				return 'dump'
			}
			state.varyings[name] = state.assignvarying
			return name
		}
		if(name in state.context){
			throw new Error('Identifier "'+name +'" exists but is undefined in '+state.callname+'(...)\n'+state.source)
		}
		else {
			//var gen = new OneJSGen() 
			// lets find the parent
			//var p = node
			//while(p.parent) p = p.parent
			//var str = gen.expand(p, null, {})
			//var name = gen.expand(node, null, {})
			console.error('Identifier cannot be resolved '+name+' in ' +state.callname+'()\n'+state.source)
			// make it throw in the function so we can find it
			state.functionref()
			//state.fn()
			//throw new Error('Identifier cannot be resolved '+name+' in ' +state.callname+'()\n'+state.source)
		}
	}

	this.Key = function(node, parent, state){
		// lets expand the object
		var obj = this.expand(node.object, node, state)
		//$$(obj, node.object.infer.id)

		// lets access the type property
		var key = node.key.name
		// lets fetch the type for our key access
		var infer = node.infer
		// we can also be referencing another object
		if(infer.fn_t === 'object'){
			// lets switch context and expand id
			var ret =  this.resolveContext(node, infer.object, key, obj, state)
			if(ret === undefined){
				console.log(infer.object, state)
				throw new Error('Cannot resolve ' + obj + '.' + key + ' in ' + state.callname + '(...)\n' + state.source)
			}
			return ret		
		}
		var struct = infer
		if(infer.fn_t === 'attribute'){
			// we can access uniform properties on arrays
			if(key in infer.array){
				return this.resolveContext(node, infer.array, key, obj, state)
			}
			// otherwise fall through to attribute struct access
			struct = infer.array.struct
		}

		node.infer = struct.keyType(key)
		if(!node.infer){
			console.log(infer.array.font)
			throw new Error('Cannot find property ' + obj + '.' + key + ' on ' + struct.id + ' in ' + state.callname + '(...)\n' + state.source)
		}

		if(!struct.id && infer.fn_t === 'attribute'){
			var name =  obj + '_DOT_' + key
			state.attributes[name] = node.infer
			return name
		}
		return (obj?obj + '.':'') + key
	}

	this.Index = function(node, parent, state){
		// ok doing an index. lets look it up
		var obj = this.expand(node.object, node, state)
		if(!node.index){ // we are an [] attribute
			return obj
		}
		return obj + '[' + this.expand(node.index, node, state) + ']'
	}

	this.texture2DSampler = {
		MIN_FILTER: 'LINEAR',
		MAG_FILTER: 'LINEAR',
		WRAP_S: 'CLAMP_TO_EDGE',
		WRAP_T: 'CLAMP_TO_EDGE'
	}

	this.texture2DShorten = {
		MIN_FILTER:'I',
		MAG_FILTER:'A',
		WRAP_S:'S',
		WRAP_T:'T',
		NEAREST:'N',
		LINEAR:'L',
		NEAREST_MIPMAP_NEAREST:'NN',
		LINEAR_MIPMAP_NEAREST:'LN',
		NEAREST_MIPMAP_LINEAR:'NL',
		LINEAR_MIPMAP_LINEAR:'LL',
		REPEAT:'R',
		CLAMP_TO_EDGE:'C',
		MIRRORED_REPEAT:'M'
	}

	// custom handle function
	this.macro_texture2D = function(node, parent, state){
		// lets build the args
		// the first argument is the texture object
		var args = node.args
		if(args.length < 2) throw new Error('texture2D needs atleast 2 arguments')
		// lets resolve the texture
		var tex_ast = args[0]
		var tex_obj, tex_name
		if(tex_ast.type === 'This'){
			// process the this
			tex_obj = state.context
			tex_name = state.basename
		}
		else if(tex_ast.type == 'Id'){
			// otherwise process the Id
			tex_name = tex_ast.name
			tex_obj = state.context[tex_name]
		}
		else{
			tex_name = this.expand(tex_ast, node, state)
			tex_obj = tex_ast.infer.object
		}
		//else throw new Error('texture2D can only resolve single identifiers or this')
		//if(!(tex_obj instanceof Texture)) throw new Error('texture2D only accepts GLTexture')

		// lets get the sampler info
		var sampler = {}
		if(args.length >=3 ){
			var obj = args[2]
			if(obj.type === 'Id') sampler = state.context[obj.name] 
			else if(obj.type === 'Object'){
				sampler = {}
				var keys = obj.keys
				for(var i = 0; i < keys.length; i++){
					var elem = keys[i]
					sampler[elem.key.name] = elem.value.value
				}
			}
			else throw new Error('texture2D needs an object as argument 3')
		}
		var dec = ''
		for(var key in this.texture2DSampler){
			if(!sampler[key]) sampler[key] = this.texture2DSampler[key]
			if(dec) dec += '_'
			dec += this.texture2DShorten[key] + this.texture2DShorten[sampler[key]]
		}
		// ok lets define the texture
		var final_name = tex_name + '_' + dec

		var out = state.textures[final_name] = {
			samplerdef:sampler,
			samplerid:dec,
			name:tex_name
		}
		node.infer = vec4
		
		return 'texture2D('+final_name+','+this.expand(args[1], node, state)+')'
	}

	this.macro_typeof = function(node, parent, state){
		var arg0 = node.args[0]
		this.expand(arg0, node, state)
		node.infer = {
			fn_t:'constructor',
			ret: arg0.infer
		}
		return node.infer.ret.id
	}

	this.Call = function(node, parent, state){
		var fn = this.expand(node.fn, node, state)
		var type = node.fn.infer
		if(!type) throw new Error('Cannot infer type for call on '+fn)
		if(!type.fn_t) throw new Error('Call on a non function '+fn)
		// set the return type		
		if(type.fn_t === 'constructor'){
			node.infer = type.ret
		}

		if(type.fn_t == 'builtin'){
			if(node.fn.name == 'texture2D'){
				return this.macro_texture2D(node, parent, state)
			}

			if(node.fn.name == 'typeof'){
				return this.macro_typeof(node, parent, state)
			}

			if(node.fn.name == 'debug'){
				return this.macro_debug(node, parent, state)
			}
		}


		// lets process the arg
		var args = this.callArgs(node, parent, state)

		if(type.fn_t === 'ast'){ // we have to expand the function
			fn = type.name

			var undecorated = fn
			// lets annotate the function name by arg type
			if(node.args) for(var i = 0; i<node.args.length; i++){
				var infer = node.args[i].infer
				if(!infer)throw new Error('Argument type cannot be inferred ' + fn + ' ' +  i)
				fn += '_' + this.getType(infer, state)
			}
			// lets 
			// check if we already compiled it
			var fnobj = state.functions[fn]
			if(!fnobj){
				state.functions[fn] = fnobj = {
					args: node.args,
					name: fn,
					undecorated:undecorated,
					deps: {}
				}
				state.call.deps[fn] = fnobj
				// set argument types on scope
				var fstate = Object.create(state)
				// mark it 
				fstate.functionref = type.functionref
				fstate.depth = ''
				fstate.source = type.source
				fstate.callname = fn
				fstate.scope = {}
				// we need to switch context
				fstate.context = type.context
				fstate.basename = type.basename || state.basename
				fstate.call = fnobj
				// ok well we have a function. lets expand it
				var fnast = type.ast

				fnobj.code = this.expand(type.ast, undefined, fstate),
				fnobj.return_t = fstate.call.return_t

				if(fstate.call.dump){
					console.log(fnobj.code)
				}
			}
			else{
				state.call.deps[fn] = fnobj
			}

			node.infer = fnobj.return_t
		}
		else if(type.fn_t === 'builtin'){
			// lets check if we are a texture2D

			if(typeof type.ret === 'number'){ // use arg type
				node.infer = node.args[type.ret - 1].infer
			} 
			else{
				node.infer = type.ret
			}
		}
		return fn + '(' + args + ')'
		// alright so we are calling something, lets check what it is.
		// if its a function we need to start inlining it
	}

	this.Var = function(node, parent, state){
		// ok we have to define our local vars on scope
		var defs = node.defs
		var ret = ''
		for(var i = 0;i < defs.length; i++){
			var def = defs[i]
			// lets expand a define
			var init = this.expand(def, node, state)

			// lets check the infer on defs
			if(i) ret += ';\n'
			ret += this.getType(def.infer, state) + ' ' + init 
			state.scope[def.id.name] = def.infer
		}
		return ret
	}

	this.Binary = function(node, parent, state){
		var left = this.expand(node.left, node, state)
		var right = this.expand(node.right, node, state)

		if(this.needsParens(node, node.left)) left = '(' + left + ')'
		if(this.needsParens(node, node.right)) right = '(' + right + ')' 

		// ok lets propagate the types and do auto type conversion.
		var left_t = this.getType(node.left.infer, state)
		var right_t = this.getType(node.right.infer, state)
		//console.log(left+node.op+right,left_t,right_t)
		// automatic type conversions
		if(left_t === 'int' && right_t === 'float'){
			left = 'float(' + left + ')'
			node.infer = float32
		}
		else if(right_t === 'int' && left_t === 'float'){
			right = 'float(' + right + ')'
		}
		else if(left_t === 'mat4'){
			if(right_t === 'vec2'){
				right = 'vec4(' + right + ',0.,1.)'
				node.infer = vec4
			}
			else if(right_t === 'vec3'){
				right = 'vec4(' + right + ',1.)'
				node.infer = vec4
			}
			else if(right_t === 'vec4'){
				node.infer = vec4
			}
		}
		else if(right_t === 'mat4'){
			if(left_t === 'vec2'){
				left = 'vec4(' + left + ',0.,1.)'
				node.infer = vec4
			}
			else if(left_t === 'vec3'){
				left = 'vec4(' + left + ',1.)'
				node.infer = vec4
			}
			else if(left_t === 'vec4'){
				node.infer = vec4
			}
		}
		else if(left_t === 'float'){
			if(right_t === 'vec2'){
				node.infer = vec2
			}
			if(right_t === 'vec3'){
				node.infer = vec3
			}
			if(right_t === 'vec4'){
				node.infer = vec4
			}
		}
		else if(left_t === 'int'){
			if(right_t === 'vec2'){
				left = 'float(' + left + ')'
				node.infer = vec2
			}
			if(right_t === 'vec3'){
				left = 'float(' + left + ')'
				node.infer = vec3
			}
			if(right_t === 'vec4'){
				left = 'float(' + left + ')'
				node.infer = vec4
			}
		} 
		else if(right_t === 'int'){
			if(left_t === 'vec2'){
				right = 'float(' + right + ')'
				node.infer = vec2
			}
			if(left_t === 'vec3'){
				right = 'float(' + right + ')'
				node.infer = vec3
			}
			if(left_t === 'vec4'){
				right = 'float(' + right + ')'
				node.infer = vec4
			}
		}

		return left + this.space + node.op + this.space + right
	}

	this.Condition = function(node, parent, state){
		
		var ret = baseclass.prototype.Condition.call(this, node, parent, state)

		// lets compare the types of 
		var then_t = node.then.infer
		var else_t = node.else.infer
		if(then_t !== else_t){
			throw new Error('Please make sure a?b:c b and c are the same type: '+ret)
		}
		node.infer = then_t
		return ret
	}

	this.Assign = function(node, parent, state){
		// ok we run our lhs in varying mode
		var right = this.expand(node.right, node, state)
		var lstate = Object.create(state)
		lstate.assignvarying = node.right.infer
		var left = this.expand(node.left, node, lstate)

		if(node.left.infer && node.left.infer.fn_t == 'dump'){
			var type = gltypes.getType(node.right.infer)
			if(type == 'int') return 'dump = vec4(vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.) * (float(' + right + ')/10.) + vec3(0.,0.33,0.67))),1.);\n'
			if(type == 'float') return 'dump = vec4(vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.) * (' + right + ') + vec3(0.,0.33,0.67))),1.);\n'
			if(type == 'ivec2') return 'dump = vec4(vec2(' + right + ').xyx/255.,1.);\n'
			if(type == 'ivec3') return 'dump = vec4(vec3(' + right + ')/255.,1.);\n'
			if(type == 'vec2') return 'dump = vec4(vec2(' + right + ').xyx/255.,1.);\n'
			if(type == 'vec3') return 'dump = vec4(' + right + ', 1.);\n'
		}

		return left + this.space + node.op + this.space + right
	}

	this.Logic = function(node, parent, state){
		// return type boolean
		var ret = baseclass.prototype.Logic.call(this, node, parent, state)
		node.infer = boolean
		return ret
	}

	this.Return = function(node, parent, state){
		var ret = 'return'

		if(node.arg){
			ret += ' ' + this.expand(node.arg, node, state)
			var type = node.arg.infer
			if(state.call.return_t !== undefined && state.call.return_t !== type){
				throw new Error('function ' + state.call.name + 'has more than one return type')
			}
			state.call.return_t = type
		}
		else{
			state.call.return_t = null
		}
		return ret
	}

	this.Function = function(node, parent, state){
		var ret = state.call.name + '('
		var args = state.call.args
		var params = node.params
		if(args.length !== params.length) throw new Error('Calling function '+state.call.name+'with wrong argcount '+args.length+' instead of '+params.length+' in '+state.callname+'(...)\n'+state.source)
		// lets generate function arguments
		for(var i = 0; i < args.length; i++){
			// lets fetch the type
			var name = this.expand(params[i], node, state)
			var type = args[i].infer
			var glname = this.getType(type, state)
			if(i) ret += ', '
			ret += glname + ' '+ name
			state.scope[name] = type // define scope variable
		}
		ret += ')'
		ret += this.expand(node.body, node, state)
		// return type
		var return_t = state.call.return_t

		if(!return_t) ret = 'void ' + ret
		else{
			ret = this.getType(return_t, state) + ' ' + ret
		}
		return ret
	}

	this.Def = function(node, parent, state){
		// lets not resolve our Id
		if(node.id.type !== 'Id') throw new Error('Def unsupported')
		var ret = node.id.name
		if(node.init){
			var init = this.expand(node.init, node, state)
			if(node.init.type == 'Call' && node.init.fn.infer.fn_t === 'constructor'){
				if(node.init.args && node.init.args.length) ret += ' = ' + init
			}
			else ret += ' = ' + init
		}
		return ret
	}

	this.Value = function(node, parent, state){
		// check if our parent is a call
		var floatcast
		if(parent && parent.type === 'Call' && parent.fn.infer && parent.fn.infer.fn_t === 'constructor' && parent.infer.primary === float32){
			floatcast = true
		}
		if(node.kind === 'num'){
			var isfloat = node.raw.indexOf('.') !== -1 || node.raw.indexOf('e') !== -1
			if(node.raw.indexOf('0x') === -1 && floatcast && !isfloat){
				node.infer = float32
				return node.raw + '.0'
			}
			if(isfloat) node.infer = float32
			else node.infer = int32
			return node.raw
		}
		if(node.kind === 'string'){
			if(node.value === 'dump'){
				state.call.dump = 1
				return ''
			}
			if(node.value === 'trace'){
				state.trace = 1
				return ''
			}
			// parseColor it
			var color = vectorParser.parseVec4(node.value)
			node.infer = vec4
			return 'vec4(' + color[0]+','+color[1]+','+color[2]+','+color[3]+')'
		}
		if(node.raw === 'true' || node.raw === 'false'){
			node.infer = bool
		}
		return node.raw 
	}

	// illegal tags
	this.ForIn = function(){ throw new Error('Cannot use for in in shader') }
	this.ForOf = function(){ throw new Error('Cannot use for of in shader') }
	this.Struct = function(){ throw new Error('Cannot use struct in shader') }
	this.Comprehension = function(){ throw new Error('Cannot use comprehension in shader') }
	this.ThisCall = function(){ throw new Error('Cannot use thiscall in shader') }
	this.Template = function(){ throw new Error('Cannot use template in shader') }
	this.Throw = function(){ throw new Error('Cannot use throw in shader') }
	this.Try = function(){ throw new Error('Cannot use try in shader') }
	this.Enum = function(){ throw new Error('Cannot use enum in shader') }
	this.Define = function(){ throw new Error('Cannot use define in shader') }
	this.New = function(){ throw new Error('Cannot use new in shader') }
	this.Nest = function(){ throw new Error('Cannot use nest in shader') }
	this.Class = function(){ throw new Error('Cannot use class in shader') }
	this.Quote = function(){ throw new Error('Cannot use quote in shader') }
	this.Rest = function(){ throw new Error('Cannot use rest in shader') }
	this.Then = function(){ throw new Error('Cannot use then in shader') }
	this.Debugger = function(){ throw new Error('Cannot use debugger in shader') }
	this.With = function(){ throw new Error('Cannot use with in shader') }
})