/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
	 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
	 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$system/base/shader', function(require, exports){

	var gltypes = require('$system/base/gltypes')

	exports.Texture =
	this.Texture =	require('./textureheadless')

	util = require('util');

	// HeadlessApi is a static object to access the headless api
	HeadlessApi = require('./headless_api')

	// HeadlessDreemgl is the interface between dreemgl and headless.
	HeadlessShader = require('./headless_shader')
	HeadlessActor = require('./headless_actor')

	/**
	 * @method compileShader
	 * Compiles the shader, or use the cached version.
	 * Construct a mesh actor if necessary and attach to the view
	 * The 'this' pointer is an object like border or hardrect
	 * @param {Object} gldevice Instance of DeviceHeadless
	 * @return {Object} shader Object containing compiled shader information.
	 *									In webgl this is an object returned by gl.createProgram
	 *									In headless, this is a hash containing a headless_shader object
	 */
	this.compileShader = function(gldevice){
		//console.log('*#*#*#*# compileShader', this.view ? this.view.id : '<SCREEN>');
		var vtx_state = this.vtx_state
		var pix_state = this.pix_state
		var vtx_code = vtx_state.code

		//console.log('vtx_code', vtx_code);
		//console.log('pix_code', pix_state.code_color);
		//console.log('====== vtx_state call', vtx_state.call);

		var pix_color = pix_state.code_color
		var pix_pick = pix_state.code_pick
		var pix_debug = pix_state.code_debug

		var gl = gldevice.gl
		var cache_id = vtx_code + pix_color + this.has_pick

		// Get the HeadlessShader object from a cache, or build one
		shader = gldevice.shadercache[cache_id]
		//if(shader) return this.headlessshader

		if (!shader) {
			// shader is a hash of compiled information and headless objects
			shader = {
				object_type: '(compiled_shader_data)'

				,debug: {}
				,pick: {}
				
				,uniset: {}
				,unilocks: {}
				,refattr: {}
				
				,texlocs: {}
			};

			// Build a HeadlessShader object and attach to shader
			var shadercode = vtx_state.code;
			var fragcode = pix_state.code_color;
			shader.headlessshader = new HeadlessShader(shadercode, fragcode);

			// Build information on uniforms, textures, and attributes
			this.getLocations(gl, shader, vtx_state, pix_state)

			//console.log('*** COMPILED ***');
			//console.log('unilocks', shader.unilocks);
			//console.log('uniset', shader.uniset);
			//console.log('refattr', shader.refattr);
			//console.log('texlocs', shader.texlocs);
			
			//TODO. Remove?
			this.compile_use = true

			if(this.compile_use) this.compileUse(shader)
			gldevice.shadercache[cache_id] = shader

		//Not supported by Headless (Yet)
//		if(pix_debug){
//			// compile the pick shader
//			var pix_debug_shader = gl.createShader(gl.FRAGMENT_SHADER)
//			gl.shaderSource(pix_debug_shader, pix_debug)
//			gl.compileShader(pix_debug_shader)
//			if (!gl.getShaderParameter(pix_debug_shader, gl.COMPILE_STATUS)){
//				var err = gl.getShaderInfoLog(pix_debug_shader)
//				console.log(err.toString(), this.annotateLines(pix_debug))
//				throw new Error(err)
//			}
//
//			shader.debug = gl.createProgram()
//			gl.attachShader(shader.debug, vtx_shader)
//			gl.attachShader(shader.debug, pix_debug_shader)
//			gl.linkProgram(shader.debug)
//			// add our pick uniform
//			this.getLocations(gl, shader.debug, vtx_state, pix_state)
//			if(this.compile_use) this.compileUse(shader.debug)
//		}
//
//		if(this.has_pick){
//			// compile the pick shader
//			var pix_pick_shader = gl.createShader(gl.FRAGMENT_SHADER)
//			gl.shaderSource(pix_pick_shader, pix_pick)
//			gl.compileShader(pix_pick_shader)
//			if (!gl.getShaderParameter(pix_pick_shader, gl.COMPILE_STATUS)){
//				var err = gl.getShaderInfoLog(pix_pick_shader)
//
//				console.log(err.toString(), this.annotateLines(pix))
//				throw new Error(err)
//			}
//
//			shader.pick = gl.createProgram()
//			gl.attachShader(shader.pick, vtx_shader)
//			gl.attachShader(shader.pick, pix_pick_shader)
//			gl.linkProgram(shader.pick)
//			// add our pick uniform
//			pix_state.uniforms['pickguid'] = vec3
//
//			this.getLocations(gl, shader.pick, vtx_state, pix_state)
//
//			if(this.compile_use) this.compileUse(shader.pick)
//		}

		}	 // if (!this.headlessshader) {


		// Build missing headless objects (if they don't exist)
		//console.log('shader', shader.object_type, shader);

		HeadlessApi.createHeadlessObjects(shader, this); //	 shader);

		return shader		
	}

	this.useShader = function(gl, shader){
		if(shader.use) return shader.use(gl, shader, this)

console.log('***************************************************************************************************OLD CODE RUNNING');
	}

	this.compile_use = true


	// Override from shader.js (HEADLESS)
	this.mapUniforms = function(gl, shader, uniforms, uniset, unilocs){
		// headless uses registerAnimatableProperty to set a uniform
		for(var key in uniforms) if(!uniset[key]){
			var type = gltypes.getType(uniforms[key])
			//uniset[key] = gltypes.uniforms[type]
			uniset[key] = gltypes.uniforms[type]
			var loc = unilocs[key] = {
				type: type,
				loc: key	// Store the name, not the location
			}
			if(key.indexOf('_DOT_') !== -1) loc.split = key.split(/_DOT_/)
		}
	}

	this.mapTextures = function(gl, shader, textures, texlocs){
		for(var key in textures){
			var tex = textures[key]
			var loc = texlocs[key] = {
				loc: key, // Store the name, not the location
				samplerdef: tex.samplerdef,
				samplerid: tex.samplerid,
				name: tex.name
			}
			if(tex.name.indexOf('_DOT_') !== -1) loc.split = tex.name.split(/_DOT_/)
		}		
	}


	// Template for generated code
	//	 {object} gl stubbed out gl object
	//	 {object} shader compiled shader object, containing headlessshader
	//									 and headlessgeometry. (see compileShader in this file)
	//	 {object} root display object (ex. border, hardrect), containing
	//												headlessmaterial, headlessrenderer, headlessactor.
	this.useShaderTemplate = function(gl, shader, root){

		// Create headless objects when first used
		if (root && !root.headlessactor) {
			HeadlessApi.createHeadlessActor(root, shader);
		}

		//console.log('useShader', root.view ? root.view.id : 'screen', 'shader', shader.object_type, 'root', root.object_type)

		// use the shader
		gl.useProgram(shader)
		var headless = HeadlessApi.headless
				var headlessactor = root ? root.headlessactor : undefined;
		var headlessmaterial = root ? root.headlessmaterial : undefined;
				var headlessgeometry = root.headlessgeometry;

		//console.log('headlessactor', headlessactor.id, 'shader', shader.headlessshader.id, 'geometry', headlessgeometry.id);

		// set uniforms
		//shader.addUniforms(shader.dreem_shader);
		SET_UNIFORMS

		// textures
		TEXTURE_START
		var texture = TEXTURE_VALUE
		// lets fetch the sampler
		var gltex = texture.TEXTURE_SAMPLER
		// lets do the texture slots correct
		if(!gltex){
			if(!texture.createGLTexture) texture = TEXTURE_VALUE = root.Texture.fromStub(texture)
			gltex = texture.createGLTexture(gl, TEXTURE_ID, TEXTURE_INFO)
			if (texture.image) {
				var ti = TEXTURE_INFO

				//TODO Get current values for sampler
				var sampler = new headless.Sampler();
				sampler.setFilterMode(headless.FILTER_MODE_LINEAR, headless.FILTER_MODE_LINEAR);
				sampler.setWrapMode(headless.WRAP_MODE_CLAMP_TO_EDGE, headless.WRAP_MODE_CLAMP_TO_EDGE);
				
				if (HeadlessApi.emitcode) {
					console.log('HEADLESSCODE: var sampler' + headlessmaterial.id + ' = new headless.Sampler();');
					console.log('HEADLESSCODE: sampler' + headlessmaterial.id + '.setFilterMode(headless.FILTER_MODE_LINEAR, headless.FILTER_MODE_LINEAR);');
					console.log('HEADLESSCODE: sampler' + headlessmaterial.id + '.setWrapMode(headless.WRAP_MODE_CLAMP_TO_EDGE, headless.WRAP_MODE_CLAMP_TO_EDGE);');
				}		


				//FIX
				if (headlessmaterial) {
						var index = headlessmaterial.addTexture(texture, ti.loc, sampler);
					gltex.texture_index = index;
					//console.log('**** **** **** headless.addTexture', ti.loc, texture.image.getWidth(), texture.image.getHeight(), 'return index', index);
				}
}
			if(!gltex) return 0
		}
		else{
			gl.activeTexture(TEXTUREGL_ID) // gl.TEXTURE0 + TEXTURE_ID
			gl.bindTexture(gl.TEXTURE_2D, gltex)
			if(texture.updateid !== gltex.updateid){
				texture.updateGLTexture(gl, gltex)
				if (gltex.texture_index) {
										var headlessmaterial = root.headlessmaterial;
					headlessmaterial.removeTexture(gltex.texture_index);
					gltex.texture_index = undefined;
					if (texture.image) {
						var ti = TEXTURE_INFO

						//TODO Get current values for sampler
						var sampler = new headless.Sampler();
						sampler.setFilterMode(headless.FILTER_MODE_LINEAR, headless.FILTER_MODE_LINEAR);
						sampler.setWrapMode(headless.WRAP_MODE_CLAMP_TO_EDGE, headless.WRAP_MODE_CLAMP_TO_EDGE);

						if (HeadlessApi.emitcode) {
							console.log('HEADLESSCODE: var sampler = new headless.Sampler();');
							console.log('HEADLESSCODE: sampler.setFilterMode(headless.FILTER_MODE_LINEAR, headless.FILTER_MODE_LINEAR);');
							console.log('HEADLESSCODE: sampler.setWrapMode(headless.WRAP_MODE_CLAMP_TO_EDGE, headless.WRAP_MODE_CLAMP_TO_EDGE);');
						}		

						var index = headlessmaterial.addTexture(texture.image, ti.loc, sampler);
						gltex.texture_index = index;
					}
				}
			}
		}
		gl.uniform1i(TEXTURE_LOC, TEXTURE_ID)
		TEXTURE_END

		// attributes
		//shader.compileShader(this);
		//console.log('---- ---- ---- addAttributeGeometry');
		//shader.headlessgeometry.addAttributeGeometry(shader, shader.attrlocs);



		var len = 0 // pull the length out of the buffers
		var lastbuf
		ATTRLOC_START
		var buf = ATTRLOC_BUF
		if(lastbuf !== buf){
			lastbuf = buf
			if(!buf.glvb) buf.glvb = gl.createBuffer()
			if(buf.length > len) len = buf.length
			gl.bindBuffer(gl.ARRAY_BUFFER, buf.glvb)
			if(!buf.clean){
				gl.bufferData(gl.ARRAY_BUFFER, buf.array, gl.STATIC_DRAW)
				buf.clean = true
			}
		}
		var loc = ATTRLOC_LOC
		gl.enableVertexAttribArray(loc)
		ATTRLOC_ATTRIBPTR
		ATTRLOC_END

		var headlessmaterial = root.headlessmaterial;

		// set up blend mode
		if(root.alpha_blend_eq.op){
			//console.log('==== alpha_blend_eq.op');
			var constant = root.constant
			if(constant) {
				//console.log('CONSTANT', constant[0], constant[1], constant[2], constant[3], 'Not implemented');
				gl.blendColor(constant[0], constant[1], constant[2], constant.length>3? constant[3]: 1)
			}
			gl.enable(gl.BLEND)
			gl.blendEquationSeparate(root.color_blend_eq.op, root.alpha_blend_eq.op)
			gl.blendFuncSeparate(
				root.color_blend_eq.src,
				root.color_blend_eq.dst,
				root.alpha_blend_eq.src,
				root.alpha_blend_eq.dst
			)

			// HEADLESS
			//console.log('*** full blend');
			headlessmaterial.setBlendMode('BLENDING_ON');
			headlessmaterial.setBlendEquation (root.color_blend_eq.op, root.color_blend_eq.op);
			headlessmaterial.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, root.alpha_blend_eq.src, root.alpha_blend_eq.dst);

		}
		else if(root.color_blend_eq.op){
			//console.log('BLEND', root.color_blend_eq);
			var constant = root.constant
			if (constant) {
				//console.log('CONSTANT 2', constant[0], constant[1], constant[2], constant[3], 'Not implemented');
				gl.blendColor(constant[0], constant[1], constant[2], constant.length>3? constant[3]: 1)
			}
			gl.enable(gl.BLEND)
			gl.blendEquation(root.color_blend_eq.op)
			gl.blendFunc(root.color_blend_eq.src, root.color_blend_eq.dst)


			headlessmaterial.setBlendMode('BLENDING_ON');
			headlessmaterial.setBlendEquation (root.color_blend_eq.op, root.color_blend_eq.op);

			//TODO Check this. What are the last two args?
			headlessmaterial.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, root.color_blend_eq.src, root.color_blend_eq.dst);
			//headlessmaterial.setBlendFunc(headless.BLEND_FACTOR_SRC_COLOR, headless.BLEND_FACTOR_DST_COLOR, root.color_blend_eq.src, root.color_blend_eq.dst);
			//headlessmaterial.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, headless.BLEND_FACTOR_ONE, headless.BLEND_FACTOR_ZERO);
			//headlessmaterial.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, headless.BLEND_FACTOR_SRC_ALPHA, headless.BLEND_FACTOR_ONE_MINUS_SRC_ALPHA);

			//headlessmaterial.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, headless.BLEND_FACTOR_CONSTANT_ALPHA, headless.BLEND_FACTOR_ONE_MINUS_CONSTANT_ALPHA);

			
		}
		else{
			//console.log('==== blend disabled');
			gl.disable(gl.BLEND)
			//HEADLESS
			headlessmaterial.setBlendMode('BLENDING_OFF');
		}
		
		// set up depth test
		if(root.depth_test_eq.func){
			console.log('***Depth test enabled. NOT IMPLEMENTED');
			gl.enable(gl.DEPTH_TEST)
			gl.depthFunc(root.depth_test_eq.func)
		}
		else{
			gl.disable(gl.DEPTH_TEST)
		}
		
		return len
	}

	// {object} shader HeadlessShader object, amended with location information
	//								 (see getLocations call above)
	// The 'this' pointer is a view
	this.compileUse = function(shader){
		// Make sure the object has headless
		//HeadlessApi.createHeadlessObjects(this.shader);

		//console.log('*****compileUse', shader.object_type, this.object_type);
		// alright lets compile our useShader from 
		var tpl = this.useShaderTemplate.toString()
		tpl = tpl.replace(/^function/, "function useshader_" + (this.view?this.view.constructor.name:'anonymous') + '_shader_' + this.constructor.name)
		// ok lets replace shit.
		// set uniforms

		var uniset = shader.uniset
		var unilocs = shader.unilocs
		var refattr = shader.refattr

		var out = 'var loc, uni\n'
		out += 'var actor = root.headlessactor\n'
		out += 'if (shader && actor) {\n'

		for(var key in uniset){
			var loc = unilocs[key]
			var split = loc.split
			var isattr = key in refattr
			if(split){
				var name = ''
				for(var i = 0; i < split.length; i++){
					if(i) name += '.'
					var part = split[i]
					if(part === 'layout' || isattr && i === split.length - 1) name += '_'
					name += part
				}
				out += '\t\tuni = root.' + name + '\n'
			}
			else{
				out += '\t\tuni = root.' 
				if(isattr) out += '_' 
				out += key + '\n'
			}
			out += '\t\tloc = shader.unilocs.' + key + '\n'
			var gen = gltypes.uniform_gen[loc.type]
			//if(gen.args == 1){

			var call = gen.call

			out += '\t\tvar val = actor.setUniformValue(\'' + key + '\',uni)\n'
		}
		out += '}\n'

		tpl = tpl.replace(/SET\_UNIFORMS/, out)

		tpl = tpl.replace(/TEXTURE\_START([\S\s]*)TEXTURE\_END/, function(m){
			var out =''
			var body = m.slice(13,-11)
			var texlocs = shader.texlocs
			var texid = 0
			for(var key in texlocs){
				var texinfo = texlocs[key]
				var split = texinfo.split

				var TEXTURE_VALUE =''
				if(split){
					TEXTURE_VALUE = 'root.' + split.join('.')
				}
				else{
					TEXTURE_VALUE = 'root.' + texinfo.name
				}

				out += body
					.replace(/TEXTURE_VALUE/g, TEXTURE_VALUE)
					.replace(/TEXTURE_SAMPLER/g, texinfo.samplerid)
					.replace(/TEXTURE_ID/g, texid)
					.replace(/TEXTURE_LOC/g, 'shader.texlocs.' + key+ '.loc')
					.replace(/TEXTURE_INFO/g, 'shader.texlocs.' + key)
					.replace(/TEXTUREGL_ID/g, gltypes.gl.TEXTURE0 + texid)
			}
//console.log('=-=-=-=-=- texlocs', out);
			return out
		})

		tpl = tpl.replace(/ATTRLOC\_START([\S\s]*)ATTRLOC\_END/, function(m){
			var body = m.slice(13,-11)
			var out = ''
			var attrlocs = shader.attrlocs
			var len = 0 // pull the length out of the buffers
			var lastbuf
			if (Object.keys(attrlocs).length > 0) {
				//console.log('*************************** attrlocs ***********************');
				//console.log(attrlocs);
				//console.log('************************************************************');
				out += 'root.headlessgeometry.addAttributeGeometry(root, shader.attrlocs)\n'
			}

			for(var key in attrlocs){
				var attrloc = attrlocs[key]
				var ATTRLOC_BUF
				if(attrloc.name){
					ATTRLOC_BUF = 'root.' + attrloc.name 
					var buf = this[attrloc.name]
				}
				else{
					ATTRLOC_BUF = 'root.' + key 
				}
				var ATTRLOC_LOC = 'shader.attrlocs.' + key +'.loc'

				if(attrloc.name){
					ATTRLOC_ATTRIBPTR = 
						'gl.vertexAttribPointer(loc, '+attrloc.slots+', gl.FLOAT, false, buf.stride, '+attrloc.offset+')'
				}
				else{
					ATTRLOC_ATTRIBPTR = 
						'if(buf.slots>4)debugger;gl.vertexAttribPointer(loc, buf.slots, gl.FLOAT, false, buf.stride, 0)'
				}

				//HACK. Setting this for text causes problems with image display
				ATTRLOC_ATTRIBPTR = ''

				out += body		
					.replace(/ATTRLOC_BUF/, ATTRLOC_BUF)
					.replace(/ATTRLOC_LOC/, ATTRLOC_LOC)
					.replace(/ATTRLOC_ATTRIBPTR/, ATTRLOC_ATTRIBPTR)
			}
			return out
		})
		
		tpl = tpl.replace(/gl.[A-Z][A-Z0-9_]+/g, function(m){
			return gltypes.gl[m.slice(3)]
		})

		shader.use = new Function('return ' + tpl)();
	}

	// all draw types
	exports.TRIANGLES = this.TRIANGLES = 0x4
	exports.LINES = this.LINES = 0x1
	exports.LINE_LOOP = this.LINE_LOOP = 0x2
	exports.LINE_STRIP = this.LINE_STRIP = 0x3
	exports.TRIANGLE_STRIP = this.TRIANGLE_STRIP = 0x5
	exports.TRIANGLE_FAN = this.TRIANGLE_FAN = 0x6

	this.drawtype = this.TRIANGLES
	
	// lets draw ourselves.
	// A view (the this pointer) makes one call to drawArrays for each shader.
	// A typical number is two (one for border and one for hardimage
	this.drawArrays = function(devicegl, sub, start, end){
		//if (this.texture) {
		//	console.trace('drawArrays');
		//}
		//console.trace('*****drawArrays', (this.view? this.view.id : '<screen>'));
		// console.log('PROG', this.vtx_state.code);
		//if(this.mydbg) debugger
		if(!this.hasOwnProperty('shader') || this.shader === undefined) this.compile(devicegl)
		var gl = devicegl.gl
				var shader = sub? this.shader[sub]: this.shader;
		// Attach the headless_obj to the shader.shader object (HEADLESS)
		var len = this.useShader(gl, shader);
		if(len) gl.drawArrays(this.drawtype, start || 0, end === undefined?len: end)
	}

})
