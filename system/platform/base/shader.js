/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, exports){

	var OneJSParser =  require('$system/parse/onejsparser')
	var GLSLGen = require('./glslgen')
	var gltypes = require('./gltypes')
	var dump = require('$system/parse/astdumper')
	var astdef = require('$system/parse/onejsdef')

	//this.default_texture = GLTexture.fromArray(new Float32Array(4*4*4), 4,4)
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

	this.visible = true
	this.pickalpha = 0.5
	
	// we can use singletons of these stateless classes
	var onejsparser = new OneJSParser()
	onejsparser.parser_cache = {}
	var glslgen = new GLSLGen()

	this._atConstructor = function(){
		this.view = this.outer
	}

	this.set_precision = true
	this.extensions = ''
	this.precision = 'highp'
	this.compileHeader = function(){
		var ret = '';
		ret += '#extension GL_OES_standard_derivatives : enable\n'
		ret += this.set_precision?'precision ' + this.precision + ' float;\n':''
		return ret + '\n'
	}

	this.compileAttributes = function(vtxattr, pixattr, context, shader){
		var ret = ''
		var attr = {}

		// and then just allocate attribute slots
		var objs = context.attr_objs = {}

		var props = {}

		if(vtxattr) for(var key in vtxattr){
			var split = key.split('_DOT_')
			var obj = split[0] === 'geometry'?'geometry_DOT_'+split[1]:'props'
			if(obj === 'props') props[split[1]] = vtxattr[key]
			var gltype = gltypes.getType(vtxattr[key])
			objs[obj] = 1
			attr[key] = gltype
		}

		if(pixattr) for(var key in pixattr) if(!(key in vtxattr)){
			var split = key.split('_DOT_')
			var obj = split[0] === 'geometry'?'geometry_DOT_'+split[1]:'props'
			if(obj === 'props') props[split[1]] = pixattr[key]
			var gltype = gltypes.getType(pixattr[key])
			objs[obj] = 1
			attr[key] = gltype
		}
		context._propstruct = define.struct(props)

		// lets define sets of attributes per object packed
		for(var key in objs){
			var struct

			if(key.indexOf('geometry_DOT_') === 0){
				struct = context._geometry[key.slice(13)].struct
			}
			else struct  = context._propstruct

			if(!struct) console.error("Not an attribute: " + key, objs)
			// lets create the minimum set of attributes for this object
			// one vec4 at a time, and then unpack them accordingly
			var left = struct.slots
			var slot = 0
			while(left){
				if(left >= 4){
					ret += 'attribute vec4 _attr_'+key+'_'+slot+';\n'
					left -=4
				}
				else if(left === 3){
					ret += 'attribute vec3 _attr_'+key+'_'+slot+';\n'
					left = 0
				}
				else if(left === 2){
					ret += 'attribute vec2 _attr_'+key+'_'+slot+';\n'
					left = 0
				}
				else if(left === 1){
					ret += 'attribute float _attr_'+key+'_'+slot+';\n'
					left = 0
				}
				slot++
			}
		}
		// create named items
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
		if(ret) ret = '//------------------- Attributes -------------------\n'+ret+'\n'
		return ret
	}
	
	var vector_component = ['x','y','z','w']
	
	function getAttrComponent(structslots, obj, offset){
		var vecpos = Math.floor(offset/4)
		var vecpart = offset%4
		if(offset === structslots - 1 && structslots%4 === 1){
			return '_attr_' + obj + '_' + vecpos
		}
		else{
			return '_attr_' + obj + '_' + vecpos + '.' + vector_component[vecpart] 
		}
	}

	function decodeAttribItem(key, attrtype, context){

		var split = key.split('_DOT_')
		var obj, prop, struct

		if(split[0] === 'geometry'){
			obj = 'geometry_DOT_'+split[1]
			prop = split[2]
			struct = context._geometry[split[1]].struct
		}
		else {
			obj = 'props'
			prop = split[1]
			struct = context._propstruct
		}

		var gltype = gltypes.getType(attrtype)

		if(!prop) offset = 0
		else offset = struct.keyInfo(prop).offset / 4

		// lets see what we want
		if(gltype === 'float'){
			return '\t' + key + ' = ' + getAttrComponent(struct.slots, obj, offset) + ';\n'
		}
		else if(gltype === 'vec2'){
			return '\t' + key + ' = vec2('
				+ getAttrComponent(struct.slots, obj, offset) + ','
				+ getAttrComponent(struct.slots, obj, offset+1)
				+ ');\n' 
		}
		else if(gltype === 'vec3'){
			return '\t' + key + ' = vec3('
				+ getAttrComponent(struct.slots, obj, offset) + ','
				+ getAttrComponent(struct.slots, obj, offset+1)+ ','
				+ getAttrComponent(struct.slots, obj, offset+2)
				+ ');\n' 
		}
		else if(gltype === 'vec4'){
			return '\t' + key + ' = vec4('
				+ getAttrComponent(struct.slots, obj, offset) + ','
				+ getAttrComponent(struct.slots, obj, offset+1)+ ','
				+ getAttrComponent(struct.slots, obj, offset+2)+ ','
				+ getAttrComponent(struct.slots, obj, offset+3)
				+ ');\n' 
		}
		else if(gltype === 'mat2'){
			var ret = '\t' + key + ' = mat2('
			for(var i = 0; i < 4;i ++) ret += (i?',':'')+ getAttrComponent(struct.slots, obj, offset+i)
			return ret + ');\n'
		}
		else if(gltype === 'mat3'){
			var ret = '\t' + key + ' = mat3('
			for(var i = 0; i < 9;i ++) ret += (i?',':'')+ getAttrComponent(struct.slots, obj, offset+i)
			return ret + ');\n'
		}

		else if(gltype === 'mat4'){
			var ret = '\t' + key + ' = mat4('
			for(var i = 0; i < 16;i ++) ret += (i?',':'')+ getAttrComponent(struct.slots, obj, offset+i)
			return ret + ');\n'
		}
		else{
			throw new Error("Cannot use type "+gltype+" as attribute. Use float,vec2,vec3,vec4,mat2,mat3,mat4")
		}
	}
	
	this.compileAttribRename = function(vtxattr, pixattr, context){
		// lets unpack all the attributes into locally named things
		var ret = ''
		if(vtxattr) for(var key in vtxattr){
			ret += decodeAttribItem(key, vtxattr[key], context)
		}
		if(pixattr) for(var key in pixattr) if(!(key in vtxattr)){
			ret += decodeAttribItem(key, pixattr[key], context)
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
			ret += 'uniform ' + gltype + ' ' + key + ';\n'
			//ret += gltype + ' ' + key + ';\n'
		}
		if(ret) ret = '//------------------- Uniforms -------------------\n'+ret+'\n'
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
				loc:gl.getUniformLocation(shader, key)
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

	this.mapAttributes = function(gl, shader, attrlocs, context){
		for(var key in context.attr_objs){

			var split = key.split('_DOT_')
			if(key.indexOf('geometry_DOT_') === 0){
				struct = context._geometry[key.slice(13)].struct
			}
			else {
				struct = context._propstruct
			}			

			// ok. now. we should map all attrlocs
			var left = struct.slots
			var slot = 0, offset = 0
			while(left){
				var attrname = '_attr_'+key+'_'+slot
				var loc = attrlocs[attrname] = {
					name:key,
					loc:gl.getAttribLocation(shader, attrname),
					slots:left>4?4:left,
					offset:offset
				}
				if(loc.loc === -1) attrlocs[attrname] = undefined
				if(left>=4){
					offset += 16
					left -=4
					slot++
				}
				else break
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
			else {
				throw new Error('Blend equation invalid (not frame or pixel)')
			}
		}
		else throw new Error('Blend equation invalid (main type) ' + eq.type + ' ' + eq.op)
		return out
	}

	this.decodeDepthEquation = function(eq, value){
		var out = {original:value, func:0}
		if(!eq) return out
		if(eq.type === 'Id' && eq.name === 'disabled'){
			out.func = 1
			return out
		}
		if(eq.type == 'Logic'){
			if(eq.left.name == 'src_depth' && eq.right.name == 'dst_depth'){
				out.func = gltypes.compare[eq.op]
				return out
			}
			else if(eq.left.name == 'src_depth' && eq.right.name == 'dst_depth'){
				out.func = gltypes.complement[eq.op]
				return out
			}
		}
		throw new Error('depth eqation not in "src_depth < dst_depth" format')
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
	this.depth_test = ''
	this.color_blend = '(1 - src_alpha) * dst_color + src_alpha * src_color'

	this.alpha = ''
	this.color = vec4(0,1,0,1)

	this.vertex = function(){
		return vec4(0,0,0,0)
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
		this.mapAttributes(gl, shader, attrlocs, this)
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
		
		var vtx_ast = onejsparser.parse(this.vertex).steps[0]

		if(vtx_ast.type == 'Function') vtx_ast = onejsparser.parse('vertex()').steps[0]
		// ok lets run the vertex codegen.
		var vtx_state = glslgen.newState(this)

		var vtx_code = glslgen.expand(vtx_ast, undefined, vtx_state)

		// pixel
		var pix_state = glslgen.newState(this, vtx_state.varyings)

		var pix_ast = onejsparser.parse('pixelentrycode()').steps[0]
		var pix_code = glslgen.expand(pix_ast, undefined, pix_state)

		var vtx = ''

		// if we have attributes in the pixelshader, we have to forward em
		// what we can do is if we have pix_attr we make them varying

		for(var key in vtx_state.uniforms){
			if(this.uniform_types[key]) vtx_state.uniforms[key] = this.uniform_types[key]
		}
		for(var key in pix_state.uniforms){
			if(this.uniform_types[key]) pix_state.uniforms[key] = this.uniform_types[key]
		}

		// lets generate the vertex shader
		vtx += this.compileHeader()
		vtx += this.compileStructs(vtx_state.structs)
		vtx += this.compileAttributes(vtx_state.attributes, pix_state.attributes, this, this)
		vtx += this.compileVaryings(vtx_state.varyings, 'Varyings')
		vtx += this.compileUniforms(vtx_state.uniforms)
		vtx += this.compileTextures(vtx_state.textures)
		vtx += this.compileFunctions(vtx_state.call)
		vtx += '//------------------- Vertex shader main -------------------\nvoid main(){\n'
		//vtx += this.compileUniformRename(vtx_state.uniforms)
		vtx += this.compileAttribRename(vtx_state.attributes, pix_state.attributes, this)
		vtx += '\tgl_Position = ' + this.toVec4(vtx_code, vtx_ast) + ';\n'
		vtx += '}\n'

		var pix_base = '', pix_color = ''//, pix_pick = '', pix_debug = ''

		pix_base += this.compileHeader()

		pix_base += this.compileStructs(pix_state.structs)
		pix_base += this.compileVaryings(pix_state.attributes, 'Attribute varyings')
		pix_base += this.compileVaryings(pix_state.varyings, 'Varyings')
		pix_base += this.compileUniforms(pix_state.uniforms)
		pix_base += this.compileTextures(pix_state.textures)
		pix_base += this.compileFunctions(pix_state.call)

		pix_color += pix_base 
		pix_color += '//------------------- Color Pixel shader main -------------------\nvoid main(){\n'
		pix_color += '\tgl_FragColor = ' + this.toVec4(pix_code, pix_ast) + ';\n'
		pix_color += '}\n'

		if(this.dump){
			console.log(vtx)
			console.log(pix_color)
			//console.log(pix_pick)
			//console.log(pix_debug)
		}
		vtx_state.code = vtx
		pix_state.code_color = pix_color
		//pix_state.code_pick = pix_pick
		//pix_state.code_debug = pix_debug

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
		//this.connectWires()
	}
	
	Object.defineProperty(this, 'pixelentry', {
		set:function(id){
			this._pixelentry = this._pixelentries.indexOf(id)
			if(this._pixelentry === -1) throw new Error('Unknown pixel entrypoint')
		}
	})

	Object.defineProperty(this, 'pixelentries',{
		get:function(){
			return this._pixelentries
		},
		set:function(map){
			this._pixelentries = map
			var pos = 0
			var code = 'function(){\n'
			for(var i = 0; i < map.length; i++){
				var entry = map[i]
				code += 'if(_pixelentry == '+pos+') return this.'+entry+'()\n'
				pos++
			}
			code += 'return vec4(1.,0.,1.,1.)\n'
			code += '}\n'
			this.pixelentrycode = code
			//lets generate a pixelshader entrypoint function
		}
	})

	this.pixelentries = ['pixel']
	this.pixelentry = 'pixel'

	this.uniform_types = {
		_pixelentry:int
	}

	this.pixel = function(){
		return vec4(0.)
	}

	this.vertex = function(){
		return vec4(0.)
	}

	Object.defineProperty(this, 'canvasverbs',{
		get:function(){
			return this._canvasverbs
		},
		set:function(verbs){
			if(!this.hasOwnProperty('canvasverbs')) this._canvasverbs = Object.create(this._canvasverbs || {})
			else this._canvasverbs = {}
			for(var key in verbs) this._canvasverbs[key] = verbs[key]
		}
	})

	Object.defineProperty(this, 'geometry', {
		get:function(){
			return this._geometry
		},
		set:function(geom){
			if(!this.hasOwnProperty('_geometry')) this._geometry = Object.create(this._geometry || {})
			for(var key in geom){
				this['_geometry_DOT_'+key] = this._geometry[key] = geom[key]
			}
		}
	})

	Object.defineProperty(this, 'props', {
		get:function(){
			return this._props
		},
		set:function(prop){
			if(!this.hasOwnProperty('_props')) this._props = Object.create(this._props || {})
			for(var key in prop){
				this._props[key] = prop[key]
				this[key] = prop[key] // store default value
			}
		}
	})


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

	this.atExtend = function(){

		var shader = this
		if(define.$platform === 'nodejs') return
		// forwar	d the view reference
		if(this.constructor.outer){
			this.view = this.constructor.outer

			if(this.dirty !== false) this.compile()

			// lets put listeners on our view so when a view uniform modifies it redraws the node
			for(var key in this.pix_state.uniforms){
				var parts = key.split('_DOT_')
				if(parts.length === 2 && parts[0] === 'view'){
					if('_' + parts[1] in this.view){
						this.view.emitFlags(1, [parts[1]])
					}
				}
			}
			for(var key in this.vtx_state.uniforms){
				var parts = key.split('_DOT_')
				if(parts.length === 2 && parts[0] === 'view'){
					if('_' + parts[1] in this.view){
						this.view.emitFlags(1, [parts[1]])
					}
				}
			}
			var name = shader.constructor.name
			function recompile_shader(){
				var oldcls = this[name]
				this[name] = {dirty:true}
				var newcls = this[name]
				for(var key in this.shader_enable){
					if(key !== name && this[key] === oldcls){
						// overwrite references
						this[key] = newcls
					}
				}
			}
			recompile_shader.shader = name

			this.view_functions = []
			for(var key in this.vtx_state.functions){
				var parts = key.split('_DOT_')
				if(parts.length === 2 && parts[0] === 'view'){
					var left = parts[1].split('_T_')[0]
					// ok lets hook this thing to invalidate our shader
					if(!this.view.hasListenerProp(left, 'shader', name)){
						this.view_functions.push(left)
						this.view.addListener(left, recompile_shader)
					}
				}
			}

			for(var key in this.pix_state.functions){
				var parts = key.split('_DOT_')
				if(parts.length === 2 && parts[0] === 'view'){
					var left = parts[1].split('_T_')[0]
					// ok lets hook this thing to invalidate our shader
					if(!this.view.hasListenerProp(left, 'shader', name)){
						this.view_functions.push(left)
						this.view.addListener(left, recompile_shader)
					}
				}
			}
			// lets put other listeners on our referenced function of view
			// and if they fire, we need to inherit in place and set dirty=true
			//console.log(this.pix_state.code_color)
		}
		else if(this !== exports.prototype) this.compile()

	}
})
