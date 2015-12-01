/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, exports){

	var OneJSParser =  require('$system/parse/onejsparser')
	var GLSLGen = require('./glslgen')
	var gltypes = require('./gltypes')
	var dump = require('$system/parse/astdumper')
	var astdef = require('$system/parse/onejsdef')

	//this.default_texture = GLTexture.fromArray(new Float32Array(4*4*4), 4,4)

	this.noise = require('$system/shaderlib/noiselib')
	this.pal = require('$system/shaderlib/palettelib')
	this.shape = require('$system/shaderlib/shapelib')
	this.math = require('$system/shaderlib/mathlib')
	this.demo = require('$system/shaderlib/demolib')
	this.material = require('$system/shaderlib/materiallib')
	this.colorlib = require('$system/shaderlib/colorlib')

	this.RAD = '1'
	this.DEG = '0.017453292519943295'
	this.PI = '3.141592653589793'
	this.PI2 = '6.283185307179586'
	this.E = '2.718281828459045'
	this.LN2 = '0.6931471805599453'
	this.LN10 = '2.302585092994046'
	this.LOG2E = '1.4426950408889634'
	this.LOG10E = '0.4342944819032518'
	this.SQRT_1_2 = '0.70710678118654757'
	this.SQRT2 = '1.4142135623730951'

	// we can use singletons of these stateless classes
	var onejsparser = new OneJSParser()
	onejsparser.parser_cache = {}
	var glslgen = new GLSLGen()

	this._atConstructor = function(){
		this.view = this.outer
	}
	this.set_precision = true

	this.extensions = ''
	// put extensions as setters to not have to scan for them
	/*
	function defExt(ext){
		Object.defineProperty(self, key,{
			get:function(){
				this.extensions.indexOf(ext) !== -1
			},
			set:function(value){
				if(this.extensions.indexOf(ext) !== -1)
					return
				if(this.extensions) this.extensions += '|'
				this.extensions += ext
			}
		})
	}*/
	//for(var key in gltypes.extensions) defExt(key)

	//this.OES_standard_derivatives = 1

	this.precision = 'highp'

	this.compileHeader = function(){
		// ehm how do we find extensions to enable?
		var ret = this.set_precision?'precision ' + this.precision + ' float;\n':''
		//	'precision ' + this.precision + ' int;'

		//var ret = ''
		for(var i = 0, exts = this.extensions.split('|'); i<exts.length; i++){
			var ext = exts[i]
			if(gltypes.extensions[ext] === 1)
				ret += '\n#extension GL_' + ext + ' : enable'
		}
		return ret + '\n'
	}

	this.compileAttributes = function(vtxattr, pixattr){
		var ret = ''
		var attr = {}
		if(vtxattr) for(var key in vtxattr){
			var gltype = gltypes.getType(vtxattr[key])
			ret += 'attribute ' + gltype + ' _' + key + ';\n'
			attr[key] = gltype
		}
		if(pixattr) for(var key in pixattr) if(!(key in vtxattr)){
			var gltype = gltypes.getType(pixattr[key])
			ret += 'attribute ' + gltype + ' _' + key + ';\n'
			attr[key] = gltype
		}
		for(var key in attr){
			var gltype = attr[key]
			// ok so if key is not in pixattr, its a normal one
			if(!pixattr || !(key in pixattr)){
				ret += gltype + ' ' + key  + ';\n'
			}
			else{
				ret += 'varying ' + gltype + ' ' + key  + ';\n'
			}
		}
		return ret
	}

	this.compileAttribRename = function(vtxattr, pixattr){
		var ret = ''
		if(vtxattr) for(var key in vtxattr){
			ret += '\t' + key + ' =  _' + key + ';\n'
		}
		if(pixattr) for(var key in pixattr) if(!(key in vtxattr)){
			ret += '\t' + key + ' =  _' + key + ';\n'
		}
		return ret
	}

	this.compileVaryings = function(varyings, name){
		var ret = ''
		for(var key in varyings){
			var gltype = gltypes.getType(varyings[key])
			ret += 'varying ' + gltype + ' ' + key + ';\n'
		}
		if(ret) ret = '//------------------- '+name+' -------------------\n'+ret+'\n'
		return ret
	}

	this.compileUniforms = function(uniforms){
		var ret = ''
		for(var key in uniforms){
			var gltype = gltypes.getType(uniforms[key])
			ret += 'uniform ' + gltype + ' _' + key + ';\n'
			ret += gltype + ' ' + key + ';\n'
		}
		if(ret) ret = '//------------------- Uniforms -------------------\n'+ret+'\n'
		return ret
	}

	this.compileUniformRename = function(uniforms){
		var ret = ''
		for(var key in uniforms){
			ret += '\t' + key + ' = _' + key + ';\n'
		}
		return ret
	}

	this.compileFunctions = function(call, mask){
		var ret = ''
		var init
		if(!mask) mask = {}, init = true
		if(call.name in mask) return ''
		mask[call.name] = 1
		// output dependencies first
		for(var key in call.deps){
			var dep = call.deps[key]
			ret += this.compileFunctions(dep, mask)
		}
		if(call.code) ret += '\n'+call.code +'\n'
		if(init) ret = '//------------------- Functions -------------------' +  ret + '\n'
		return ret
	}

	this.compileTextures = function(textures){
		var ret = ''
		for(var key in textures){
			ret += 'uniform sampler2D ' + key + ';\n'
		}
		if(ret) ret = '//------------------- Textures -------------------\n'+ret+'\n'
		return ret
	}

	this.compileStructs = function(structs){
		var ret = ''
		for(var key in structs){
			var struct = structs[key]
			// ok so.. we need to write the struct
			ret += 'struct ' + key + '{\n'
			var defs = struct.def
			for(var slotname in defs){
				var slot = defs[slotname]
				if(typeof slot === 'function'){
					ret += '\t' + gltypes.getType(slot) + ' ' + slotname + ';\n'
				}
			}
			ret += '};\n'
		}
		if(ret) ret = '\n//------------------- Structs -------------------\n'+ret+'\n'
		return ret
	}

	this.mapUniforms = function(gl, shader, uniforms, uniset, unilocs){
		for(var key in uniforms) if(!uniset[key]){
			var type = gltypes.getType(uniforms[key])
			uniset[key] = gltypes.uniforms[type]
			var loc = unilocs[key] = {
				type: type,
				loc:gl.getUniformLocation(shader, '_' + key)
			}
			if(key.indexOf('_DOT_') !== -1) loc.split = key.split(/_DOT_/)
		}
	}

	this.mapTextures = function(gl, shader, textures, texlocs){
		for(var key in textures){
			var tex = textures[key]
			var loc = texlocs[key] = {
				loc: gl.getUniformLocation(shader, key),
				samplerdef: tex.samplerdef,
				samplerid: tex.samplerid,
				name: tex.name
			}
			if(tex.name.indexOf('_DOT_') !== -1) loc.split = tex.name.split(/_DOT_/)
		}		
	}

	this.mapAttributes = function(gl, shader, attributes, attrlocs, context){
		for(var key in attributes){
			var loc = attrlocs[key] = {
				loc:gl.getAttribLocation(shader, '_' + key)
			}
			if(key.indexOf('_DOT_') !== -1){
				// okay lets look up the type
				var split = key.split(/_DOT_/)
				// ok so we need to look up split[0] on context
				var name = loc.name = split[0]
				var geom = context[name]
				var last = geom.struct
				var offset = 0
				for(var i = 1; i < split.length; i++){					
					// lets find split on our struct
					var info = last.keyInfo(split[i])
					offset += info.offset
					last = info.type
				}
				if(!last) throw new Error('Cannot find attribute ' + key)
				loc.slots = last.slots
				loc.offset = offset
			}
		}
	}

	this.annotateLines = function(text){
		var lines = text.split(/\n/)
		var ret = ''
		for(var i = 0; i < lines.length; i++){
			ret += (i+1)+':  '+lines[i] + '\n'
		}
		return ret
	}

	this.toVec4 = function(str, ast, str2, ast2){
		if(ast.infer === vec4){
			if(ast2 && ast2.infer === float32){
				return '('+str+')*vec4(1.,1.,1.,'+str2+')'
			}
			return str
		}
		if(ast.infer === vec3){
			if(ast2 && ast2.infer === float32){
				return 'vec4('+str+','+str2+')'
			}
			return 'vec4(' + str + ',1.)'
		}
		if(ast.infer === vec2) return 'vec4(' + str + ',0.,1.)'
		if(ast.infer === float32) return '(' + str + ').xxxx'
		return str
	}

	this.decodeBlendFactor = function(node, key){
		var gl = gltypes.gl
		if(node.type == 'Id') return gl.ONE
		if(node.type == 'Binary'){
			var factor = node.left
			if(node.right.name != key) throw new Error('Blend equation needs to have either pixel or frame on the right side of the *')
			if(factor.type == 'Binary'){ // its a one minus situation
				if(factor.op != '-' || factor.left.type != 'Value' || factor.left.value != 1) throw new Error('Invalid blending (only 1- supported)')
				var name = factor.right.name
				if(name === 'src_alpha') return gl.ONE_MINUS_SRC_ALPHA
				if(name === 'src_color') return gl.ONE_MINUS_SRC_COLOR
				if(name === 'dst_color') return gl.ONE_MINUS_DST_COLOR
				if(name === 'dst_alpha') return gl.ONE_MINUS_DST_ALPHA
				if(name === 'constant_color') return GL.ONE_MINUS_CONSTANT_COLOR
				if(name === 'constant_alpha') return GL.ONE_MINUS_CONSTANT_ALPHA
				throw new Error('implement one minus mode')
			}
			if(factor.type != 'Id') throw new Error('Invalid blending (factor not an Id)')
			var name = factor.name
			if(name === 'src_alpha') return gl.SRC_ALPHA
			if(name === 'src_color') return gl.SRC_COLOR
			if(name === 'dst_color') return gl.DST_COLOR
			if(name === 'dst_alpha') return gl.DST_ALPHA
			if(name === 'constant_color') return GL.CONSTANT_COLOR
			if(name === 'constant_alpha') return GL.CONSTANT_ALPHA
			// todo constant color and constant alpha
		}
		throw new Error('Invalid blending factor (node type invalid)')
	}

	this.decodeBlendEquation = function(eq, value){
		var gl = gltypes.gl
		var out = {original:value}
		if(!eq) return out
		if(eq.type == 'Binary' && (eq.op == '+' || eq.op == '-')){ // its the main equation
			var left = eq.left
			var right = eq.right

			if(eq.op == '+') out.op = gl.FUNC_ADD
			else if(eq.op == '-') out.op = gl.FUNC_SUBTRACT

			if(left.type == 'Id' && left.name == 'src_color' || 
			   left.type == 'Binary' && left.right.name == 'src_color'){
				left = eq.right, right = eq.left
				if(eq.op == '-') out.op = gl.FUNC_REVERSE_SUBTRACT
			}
			// left should be frame, right should be pixel
			out.dst = this.decodeBlendFactor(left, 'dst_color')
			out.src = this.decodeBlendFactor(right, 'src_color')
		}
		else if(eq.type == 'Binary' && eq.op == '*'){ // its a single mul
			out.op = gl.FUNC_ADD
			// the right side needs to be either frame or pixel
			if(eq.right.name == 'dst_color'){
				out.src = gl.ZERO
				out.dst = this.decodeBlendFactor(eq, 'dst_color')
			}
			else if(eq.right.name == 'src_color'){
				out.dst = gl.ZERO
				out.src = this.decodeBlendFactor(eq, 'src_color')
			}
			else throw new Error('Blend equation needs to have either pixel or frame on the right side of the *')
		} 
		else if(eq.type == 'Id'){
			out.op = gl.FUNC_ADD
			if(eq.name == 'dst_color'){
				out.src = gl.ZERO
				out.dst = gl.ONE
			}
			else if(eq.name == 'src_color'){
				out.src = gl.ONE
				out.dst = gl.ZERO
			}
			else{
				throw new Error('Blend equation invalid (not frame or pixel)')
			}
		}
		else throw new Error('Blend equation invalid (main type) ' + eq.type + ' ' + eq.op)
		return out
	}

	this.decodeDepthEquation = function(eq, value){
		var out = {original:value}
		if(!eq) return out
		if(eq.type == 'Logic' && eq.left.name == 'src_depth' && eq.right.name == 'dst_depth'){
			out.func = gltypes.compare[eq.op]
			return out
		}
		else throw new Error('depth eqation not in pixel > frame format')
	}

	this.decodeStencilEquation = function(gl, eq, value){
		if(!eq) return {}
		else 
		if(eq.type == 'Value'){

		}
	}
	var blend_eq_cache = {}
	// lets define the blending equation setters
	Object.defineProperty(this, 'color_blend', {
		get:function(){ return this.color_blend_eq && this.color_blend_eq.original },
		set:function(value){
			this.color_blend_eq = blend_eq_cache[value] || (blend_eq_cache[value] = this.decodeBlendEquation(onejsparser.parse(value).steps[0], value))
		}
	})

	Object.defineProperty(this, 'alpha_blend', {
		get:function(){ return this.alpha_blend_eq && this.alpha_blend_eq.original },
		set:function(value){
			this.alpha_blend_eq = blend_eq_cache[value] || (blend_eq_cache[value] = this.decodeBlendEquation(onejsparser.parse(value).steps[0], value))
		}
	})

	var depth_eq_cache = {}
	Object.defineProperty(this, 'depth_test', {
		get:function(){ return this.depth_test_eq && this.depth_test_eq.original },
		set:function(value){
			this.depth_test_eq = depth_eq_cache[value] || (depth_eq_cache[value] = this.decodeDepthEquation(onejsparser.parse(value).steps[0], value))
		}
	})

	this.alpha_blend = ''
	//this.depth_test = 'src_depth > dst_depth'
	this.depth_test = ''
	this.color_blend = '(1 - src_alpha) * dst_color + src_alpha * src_color'

	this.alpha = ''
	this.color = vec4(0,1,0,1)

	this.position = function(){
		return vec4(0,0,0,0)
	}

	this.has_pick = true
	this.update_dirty = true

	this.reupdate = function(key){
		if(!this.update_dirty){
			this.update_dirty = key
			if(this.view && !this.view.update_dirty){
				this.view.update_dirty = true
				this.view.redraw()
			}
		}
	}

	var ignore_compare = {
		outer:1, 
		view:1, 
		shadername:1, 
		order:1, 
		shader:1, 
		update_dirty:1, 
		dirty_props:1, 
		pix_state:1, 
		vtx_state:1,
		_view_listeners:1,
		pickguid:1
	}

	this.isShaderEqual = function(prevshader){
		for(var key in this){
			if(key in ignore_compare) continue
			if(this.__lookupSetter__(key)) continue
			// we also have to ignore geometry..

			var value = this[key]
			var other = prevshader[key]
			// check type
			if(!(value && value.struct && !value.struct.equals || // geometry object
				value && value.struct && other && other.struct && value.struct.equals && value.struct.equals(value, other) || // vector type
				typeof value === 'function' && typeof other === 'function' && value.toString() === other.toString() || value === other)){ // function
				return false
			}
		}
		return true
	}

	this.monitorCompiledProperty = function(name){
		if(this.__lookupSetter__(name)) return
		var get = '_' + name
		this[get] = this[name]
		Object.defineProperty(this, name, {
			enumerable:false,
			configurable:false,
			get:function(){
				return this[get]
			},
			set:function(value){
				if(this[get] === value) return
				this.dirty = true
				if(!this.hasOwnProperty('dirty_props')) this.dirty_props = []
				this.dirty_props.push(name)
				// trigger a recompile
				if(this.hasOwnProperty('shader')) this.shader = undefined
				this[get] = value
			}
		})
	}
	
	this.getLocations = function(gl, shader, vtx_state, pix_state){
		// get uniform locations
		var uniset = shader.uniset = {}
		var unilocs = shader.unilocs = {}
		var refattr = shader.refattr = {}
		for(var key in vtx_state.reference_is_attr) refattr[key] = 1
		for(var key in pix_state.reference_is_attr) refattr[key] = 1
			
		this.mapUniforms(gl, shader, vtx_state.uniforms, uniset, unilocs)
		this.mapUniforms(gl, shader, pix_state.uniforms, uniset, unilocs)

		// lets get sampler2D uniforms
		var texlocs = shader.texlocs = {}
		this.mapTextures(gl, shader, vtx_state.textures, texlocs)
		this.mapTextures(gl, shader, pix_state.textures, texlocs)

		// get attribute locations
		var attrlocs = shader.attrlocs = {}
		this.mapAttributes(gl, shader, vtx_state.attributes, attrlocs, this)
		this.mapAttributes(gl, shader, pix_state.attributes, attrlocs, this)		
	}

	// compile the shader
	this.compile = function(gldevice){

		if(gldevice && this.dirty === false){
			// lets walk up the prototype chain till we hit dirty === false

			var proto = this
			while(!proto.hasOwnProperty('dirty')){
				proto = Object.getPrototypeOf(proto)
			}
			if(!proto.hasOwnProperty('shader')){
				this.shader = proto.shader = this.compileShader(gldevice)
			}
			else{
				this.shader = proto.shader
			}
			return
		}
		// lets run the type inferencer on the pixel shader

		var vtx_ast = onejsparser.parse(this.position).steps[0]
		if(vtx_ast.type == 'Function') vtx_ast = onejsparser.parse('position()').steps[0]
		// ok lets run the vertex codegen.
		var vtx_state = glslgen.newState(this)

		var vtx_code = glslgen.expand(vtx_ast, undefined, vtx_state)
		// pixel
		var pix_state = glslgen.newState(this, vtx_state.varyings)

		// support both immediate and expression color
		if(this.color === undefined){
			return
		}
		if(typeof this.color === 'object'){
			if(this.color.length == 3) var pix_ast = {infer:vec3}
			else var pix_ast = {infer:vec4}
			var pix_code = '_color'
			pix_state.uniforms.color = pix_ast.infer
		}
		else{
			var pix_ast = onejsparser.parse(this.color).steps[0]
			if(pix_ast.type == 'Function') pix_ast = onejsparser.parse('color()').steps[0]
			var pix_code = glslgen.expand(pix_ast, undefined, pix_state)
		}

		// support imediate alpha value and alpha expressions
		if(typeof this.alpha === 'number'){
			pix_state.uniforms.alpha = float32
			var alpha_ast = {infer:float32}
			var alpha_code = '_alpha'
		}
		else{
			var alpha_ast = onejsparser.parse(this.alpha).steps[0]
			var alpha_code = ''
			if(alpha_ast && alpha_ast.type == 'Function') alpha_ast = onejsparser.parse('alpha()').steps[0]
			if(alpha_ast){
				alpha_code = glslgen.expand(alpha_ast, undefined, pix_state)
			}
		}
		var vtx = ''

		// if we have attributes in the pixelshader, we have to forward em
		// what we can do is if we have pix_attr we make them varying

		// lets generate the vertex shader
		vtx += this.compileHeader()
		vtx += this.compileStructs(vtx_state.structs)
		vtx += this.compileAttributes(vtx_state.attributes, pix_state.attributes)
		vtx += this.compileVaryings(vtx_state.varyings, 'Varyings')
		vtx += this.compileUniforms(vtx_state.uniforms)
		vtx += this.compileTextures(vtx_state.textures)
		vtx += this.compileFunctions(vtx_state.call)
		vtx += '//------------------- Vertex shader main -------------------\nvoid main(){\n'
		vtx += this.compileUniformRename(vtx_state.uniforms)
		vtx += this.compileAttribRename(vtx_state.attributes, pix_state.attributes)
		vtx += '\tgl_Position = ' + this.toVec4(vtx_code, vtx_ast) + ';\n'
		vtx += '}\n'

		var pix_base = '', pix_color = '', pix_pick = '', pix_debug = ''

		pix_base += this.compileHeader()
		if(pix_state.debug.type){
			this.debug_type = gltypes.getType(pix_state.debug.type)
			pix_base += this.debug_type + ' dbg;\n'
		}
		if(pix_state.dump.set){
			pix_base += 'vec4 dump;\n'
		}

		pix_base += this.compileStructs(pix_state.structs)
		pix_base += this.compileVaryings(pix_state.attributes, 'Attribute varyings')
		pix_base += this.compileVaryings(pix_state.varyings, 'Varyings')
		pix_base += this.compileUniforms(pix_state.uniforms)
		pix_base += this.compileTextures(pix_state.textures)
		pix_base += this.compileFunctions(pix_state.call)
	
		if(this.debug_type){
			pix_debug += pix_base
			pix_debug += '//------------------- Debug Pixel shader main -------------------\nvoid main(){\n'
			pix_debug += this.compileUniformRename(pix_state.uniforms)

			if(this.debug_type == 'int') pix_debug += '\tdbg = 20;\n'
			if(this.debug_type == 'float') pix_debug += '\tdbg = 20.;\n'
			if(this.debug_type == 'vec2') pix_debug += '\tdbg = vec2(.2,.2);\n'
			if(this.debug_type == 'ivec2') pix_debug += '\tdbg = ivec2(20,20);\n'
			if(this.debug_type == 'vec3') pix_debug += '\tdbg = vec3(.2,.2,.2);\n'
			if(this.debug_type == 'ivec3') pix_debug += '\tdbg = ivec3(20,20);\n'

			pix_debug += '\t' + this.toVec4(pix_code, pix_ast, alpha_code, alpha_ast) + ';\n'
			if(this.debug_type == 'int') pix_debug += '\tgl_FragColor = vec4(mod(abs(float(dbg)),256.)/255.,abs(float(dbg/256))/256.,dbg >= 0? 1.: 0.,1.);\n'
			if(this.debug_type == 'float') pix_debug += '\tgl_FragColor = vec4(mod(abs(dbg),1.),float(floor(abs(dbg))/256.),dbg >= 0.? 1.: 0.,1.);\n'
			if(this.debug_type == 'vec2') pix_debug += '\tgl_FragColor = vec4(clamp(dbg.x,0.,1.),clamp(dbg.y,0.,1.),0,1.);\n'
			if(this.debug_type == 'ivec2') pix_debug += '\tgl_FragColor = vec4(float(dbg.x)/255.,float(dbg.y)/255.,0,1.);\n'
			if(this.debug_type == 'vec3') pix_debug += '\tgl_FragColor = vec4(clamp(dbg.x,0.,1.),clamp(dbg.y,0.,1.),clamp(dbg.z,0.,1.),1.);\n'
			if(this.debug_type == 'ivec3') pix_debug += '\tgl_FragColor = vec4(float(dbg.x)/255.,float(dbg.y)/255.,float(dbg.z)/255.,1.);\n'
			pix_debug += '}\n'
		}

		pix_color += pix_base 

		pix_color += '//------------------- Color Pixel shader main -------------------\nvoid main(){\n'
		pix_color += this.compileUniformRename(pix_state.uniforms)
		if(pix_state.dump.set){
			pix_color += '\tdump = vec4(.5,.5,.5,1.);\n'
		}
		pix_color += '\tgl_FragColor = ' + this.toVec4(pix_code, pix_ast, alpha_code, alpha_ast) + ';\n'
		if(pix_state.dump.set){
			pix_color += '\tgl_FragColor = dump;\n'
		}
		pix_color += '}\n'

		pix_pick += pix_base
		pix_pick += 'uniform vec3 _pickguid;\n'
		pix_pick += '//------------------- Pick Pixel shader main -------------------\nvoid main(){\n'
		pix_pick += this.compileUniformRename(pix_state.uniforms)
		pix_pick += '\tvec4 col = ' + this.toVec4(pix_code, pix_ast, alpha_code, alpha_ast) + ';\n'
		pix_pick += ''
		pix_pick += '\tgl_FragColor = vec4(_pickguid.xyz, col.a>0.5?1.:0.);\n'
		pix_pick += '}\n'

		if(this.dump){
			console.log(vtx)
			console.log(pix_color)
			console.log(pix_pick)
			console.log(pix_debug)
		}
		vtx_state.code = vtx
		pix_state.code_color = pix_color
		pix_state.code_pick = pix_pick
		pix_state.code_debug = pix_debug

		this.pix_state = pix_state
		this.vtx_state = vtx_state

		//if(!this.device){
		// turn shader into dirty observed thing
		// lets look at our local funciton refs
		for(var key in vtx_state.functions){
			var name = vtx_state.functions[key].undecorated
			if(name.indexOf('_DOT_') === -1) this.monitorCompiledProperty(name)
		}

		for(var key in pix_state.functions){
			var name = pix_state.functions[key].undecorated
			if(name.indexOf('_DOT_') === -1) this.monitorCompiledProperty(name)
		}

		this.dirty = false

		if(!gldevice){
			return
		}
		this.shader = this.compileShader(gldevice)

		this.connectWires()
	}		

	this.atExtend = function(){
		if(define.$platform === 'nodejs') return
		// forward the view reference
		if(this.constructor.outer){
			this.view = this.constructor.outer
			this.compile()
			// lets put listeners on our view so when a view uniform modifies it redraws the node
			for(var key in this.pix_state.uniforms){
				var parts = key.split('_DOT_')
				if(parts.length === 2 && parts[0] === 'view'){
					if('_' + parts[1] in this.view){
						this.view.addListener(parts[1], this.view.redraw)
					}
				}
			}
		}
		else if(this !== self) this.compile()

	}
})