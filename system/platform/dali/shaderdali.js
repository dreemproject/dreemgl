/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define.class('$system/base/shader', function(require, exports){

	var gltypes = require('$system/base/gltypes')

	exports.Texture =
	this.Texture =  require('./texturedali')

	util = require('util');

	// DaliApi is a static object to access the dali api
	DaliApi = require('./dali_api')

	// DaliDreemgl is the interface between dreemgl and dali.
	DaliShader = require('./dali_shader')
	DaliActor = require('./dali_actor')

	/**
	 * @method compileShader
	 * Compiles the shader, or use the cached version.
	 * Construct a mesh actor if necessary and attach to the view
	 * The 'this' pointer is an object like border or hardrect
	 * @param {Object} gldevice Instance of DeviceDali
	 * @return {Object} shader Object containing compiled shader information.
	 *                  In webgl this is an object returned by gl.createProgram
	 *                  In dali, this is a hash containing a dali_shader object
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

		// Get the DaliShader object from a cache, or build one
		shader = gldevice.shadercache[cache_id]
		//if(shader) return this.dalishader

		if (!shader) {
			// shader is a hash of compiled information and dali objects
			shader = {
				object_type: '(compiled_shader_data)'

				,debug: {}
				,pick: {}
				
				,uniset: {}
				,unilocks: {}
				,refattr: {}
				
				,texlocs: {}
			};

			// Build a DaliShader object and attach to shader
			var shadercode = vtx_state.code;
			var fragcode = pix_state.code_color;
			shader.dalishader = new DaliShader(shadercode, fragcode);

		//DEV
		// Compile the dali objects
		//shader.compileShader(this, dalishader);

		//Not used by Dali
//		var vtx_shader = gl.createShader(gl.VERTEX_SHADER)
//		gl.shaderSource(vtx_shader, vtx_code)
//		gl.compileShader(vtx_shader)
//		if (!gl.getShaderParameter(vtx_shader, gl.COMPILE_STATUS)){
//			var err = gl.getShaderInfoLog(vtx_shader)
//			console.error(err.toString(), this.annotateLines(vtx_code))
//			return
//			//throw new Error(err)
//		}
//		
//		// compile the shader
//		var pix_color_shader = gl.createShader(gl.FRAGMENT_SHADER)
//		gl.shaderSource(pix_color_shader, pix_color)
//		gl.compileShader(pix_color_shader)
//		if (!gl.getShaderParameter(pix_color_shader, gl.COMPILE_STATUS)){
//			var err = gl.getShaderInfoLog(pix_color_shader)
//
//			console.error(err.toString(), this.annotateLines(pix_color))
//			return
//			//throw new Error(err)
//		}
//
//		shader = gldevice.shadercache[cache_id] = gl.createProgram()
//		gl.attachShader(shader, vtx_shader)
//		gl.attachShader(shader, pix_color_shader)
//		gl.linkProgram(shader)

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

		//Not supported by Dali (Yet)
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

		}  // if (!this.dalishader) {


		// Build missing dali objects (if they don't exist)
		//console.log('shader', shader.object_type, shader);

		//console.trace('CALLING createDaliObjects');
		DaliApi.createDaliObjects(shader, this); //  shader);

		//console.log('shader has', Object.keys(shader));

		//DaliApi.createDaliActor(this, shader);


		//console.log('---- ---- ---- ADDING TEXTURE INFO');
		//shader.addAttributeGeometry(this, shader.attrlocs);

		return shader		
	}

	this.useShader = function(gl, shader){
		if(shader.use) return shader.use(gl, shader, this)

console.log('***************************************************************************************************OLD CODE RUNNING');
	}

	this.compile_use = true


	// Override from shader.js (DALI)
	this.mapUniforms = function(gl, shader, uniforms, uniset, unilocs){
		// dali uses registerAnimatableProperty to set a uniform
		for(var key in uniforms) if(!uniset[key]){
			var type = gltypes.getType(uniforms[key])
			//uniset[key] = gltypes.uniforms[type]
			uniset[key] = gltypes.uniforms[type]
			var loc = unilocs[key] = {
				type: type,
				loc: key  // Store the name, not the location
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
	//   {object} gl stubbed out gl object
	//   {object} shader compiled shader object, containing dalishader
	//                   and daligeometry. (see compileShader in this file)
	//   {object} root display object (ex. border, hardrect), containing
	//                        dalimaterial, dalirenderer, daliactor.
	this.useShaderTemplate = function(gl, shader, root){

		// Create dali objects when first used
		if (root && !root.daliactor) {
			DaliApi.createDaliActor(root, shader);
		}

		//console.log('useShader', root.view ? root.view.id : 'screen', 'shader', shader.object_type, 'root', root.object_type)

		// use the shader
		gl.useProgram(shader)
		var dali = DaliApi.dali
        var daliactor = root ? root.daliactor : undefined;
		var dalimaterial = root ? root.dalimaterial : undefined;
        var daligeometry = root.daligeometry;

		//console.log('daliactor', daliactor.id, 'shader', shader.dalishader.id, 'geometry', daligeometry.id);

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
				var sampler = new dali.Sampler();
				sampler.setFilterMode(dali.FILTER_MODE_LINEAR, dali.FILTER_MODE_LINEAR);
				sampler.setWrapMode(dali.WRAP_MODE_CLAMP_TO_EDGE, dali.WRAP_MODE_CLAMP_TO_EDGE);
				
				if (DaliApi.emitcode) {
					console.log('DALICODE: var sampler' + dalimaterial.id + ' = new dali.Sampler();');
					console.log('DALICODE: sampler' + dalimaterial.id + '.setFilterMode(dali.FILTER_MODE_LINEAR, dali.FILTER_MODE_LINEAR);');
					console.log('DALICODE: sampler' + dalimaterial.id + '.setWrapMode(dali.WRAP_MODE_CLAMP_TO_EDGE, dali.WRAP_MODE_CLAMP_TO_EDGE);');
				}		


				//FIX
				if (dalimaterial) {
  					var index = dalimaterial.addTexture(texture, ti.loc, sampler);
					gltex.texture_index = index;
					//console.log('**** **** **** dali.addTexture', ti.loc, texture.image.getWidth(), texture.image.getHeight(), 'return index', index);
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
                    var dalimaterial = root.dalimaterial;
					dalimaterial.removeTexture(gltex.texture_index);
					gltex.texture_index = undefined;
					if (texture.image) {
						var ti = TEXTURE_INFO

						//TODO Get current values for sampler
						var sampler = new dali.Sampler();
						sampler.setFilterMode(dali.FILTER_MODE_LINEAR, dali.FILTER_MODE_LINEAR);
						sampler.setWrapMode(dali.WRAP_MODE_CLAMP_TO_EDGE, dali.WRAP_MODE_CLAMP_TO_EDGE);

						if (DaliApi.emitcode) {
							console.log('DALICODE: var sampler = new dali.Sampler();');
							console.log('DALICODE: sampler.setFilterMode(dali.FILTER_MODE_LINEAR, dali.FILTER_MODE_LINEAR);');
							console.log('DALICODE: sampler.setWrapMode(dali.WRAP_MODE_CLAMP_TO_EDGE, dali.WRAP_MODE_CLAMP_TO_EDGE);');
						}		

						var index = dalimaterial.addTexture(texture.image, ti.loc, sampler);
						gltex.texture_index = index;
					}
				}
			}
		}
		gl.uniform1i(TEXTURE_LOC, TEXTURE_ID)
		if(TEXTURE_ID > 0)debugger
		TEXTURE_END

		// attributes
		//shader.compileShader(this);
		//console.log('---- ---- ---- addAttributeGeometry');
		//shader.daligeometry.addAttributeGeometry(shader, shader.attrlocs);



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

		var blender = root.dalimaterial.hasBlender() ? root.dalimaterial : root.dalirenderer;

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

			// DALI
			//console.log('*** full blend');
			blender.setBlendMode(dali.BLENDING_ON);
			blender.setBlendEquation (root.color_blend_eq.op, root.color_blend_eq.op);
			blender.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, root.alpha_blend_eq.src, root.alpha_blend_eq.dst);

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


			blender.setBlendMode(dali.BLENDING_ON);
			blender.setBlendEquation (root.color_blend_eq.op, root.color_blend_eq.op);

			//TODO Check this. What are the last two args?
			blender.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, root.color_blend_eq.src, root.color_blend_eq.dst);
			//dalimaterial.setBlendFunc(dali.BLEND_FACTOR_SRC_COLOR, dali.BLEND_FACTOR_DST_COLOR, root.color_blend_eq.src, root.color_blend_eq.dst);
			//dalimaterial.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, dali.BLEND_FACTOR_ONE, dali.BLEND_FACTOR_ZERO);
			//dalimaterial.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, dali.BLEND_FACTOR_SRC_ALPHA, dali.BLEND_FACTOR_ONE_MINUS_SRC_ALPHA);

			//dalimaterial.setBlendFunc(root.color_blend_eq.src, root.color_blend_eq.dst, dali.BLEND_FACTOR_CONSTANT_ALPHA, dali.BLEND_FACTOR_ONE_MINUS_CONSTANT_ALPHA);

			
		}
		else{
			//console.log('==== blend disabled');
			gl.disable(gl.BLEND)
			//DALI
			blender.setBlendMode(dali.BLENDING_OFF);
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

	// {object} shader DaliShader object, amended with location information
	//                 (see getLocations call above)
	// The 'this' pointer is a view
	this.compileUse = function(shader){
		// Make sure the object has dali
		//DaliApi.createDaliObjects(this.shader);

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
		out += 'var actor = root.daliactor\n'
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
			//if(call !== 'uniformMatrix4fv' && call !== 'uniformMatrix3fv' && call !== 'uniformMatrix2fv'){
			//	out += '\t\tif(loc.value !== uni) loc.value = uni, '
			//}

			// Update uniform. Use registerAnimatableProperty only if 
			// the value is not set yet. (DALI)
			//TODO Optimize
            //out += 'console.log(\'------ROOT\', root.view.id, root.daliactor.object_type)\n'
            out += '\t\tvar val = actor.setUniformValue(\'' + key + '\',uni)\n'

// Use addUniformValue instead of this code
/*
            out += '\t\tvar val = shader.getArrayValue(uni)\n'
            out += '\t\tvar v = shader.meshActor._' + key + '\n'
            out += '\tconsole.log(\'key\',\'' + key + '\',\'value\', val)\n'
			out += '\t\tif (v) {v = val} \n'
            out += '\t\telse {shader.meshActor.registerAnimatableProperty(\'_' + key + '\', val)}\n'
*/


/*
			out += 'gl.' + gen.call + '(loc.loc'

			if(gen.mat) out += ', false'

			if(gen.args == 1) out += ',uni)\n'
			if(gen.args == 2) out += ',uni[0], uni[1])\n'
			if(gen.args == 3) out += ',uni[0], uni[1], uni[2])\n'
			if(gen.args == 4) out += ',uni[0], uni[1], uni[2], uni[3])\n'
			if(gen.args === this.loguni) out += 'if(typeof uni === "number")console.log(uni)\n'
*/
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
//console.log('key', key);
//console.log('TEXTURE_VALUE', TEXTURE_VALUE);
//console.log('TEXTURE_SAMPLER', texinfo.samplerid);
//console.log('TEXTURE_ID', texid);
//console.log('TEXTURE_LOC', 'shader.texlocs.' + key+ '.loc');
//console.log('TEXTURE_INFO', 'shader.texlocs.' + key);
//console.log('TEXTUREGL_ID', gltypes.gl.TEXTURE0 + texid);

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
				out += 'root.daligeometry.addAttributeGeometry(root, shader.attrlocs)\n'
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

				//ATTRLOC_ATTRIBPTR = 'console.log(\'buf type 1\', \'' + key + '\',' + attrloc.slots + ', buf.stride, buf.length,' + attrloc.offset + ');daligeometry.addVertices(\'' + key + '\', buf.array, ' + attrloc.slots + ', buf.stride, ' + attrloc.offset + ')'
				}
				else{
					ATTRLOC_ATTRIBPTR = 
						'if(buf.slots>4)debugger;gl.vertexAttribPointer(loc, buf.slots, gl.FLOAT, false, buf.stride, 0)'

				//ATTRLOC_ATTRIBPTR = 'console.log(\'buf type 2\', \'' + key + '\',buf.slots, buf.stride, buf.length);daligeometry.addVertices(\'' + key + '\', buf.array, buf.slots, buf.stride, 0)'
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

		//if (shader.texlocs && shader.texlocs.length > 0)
		//console.log('FUNCTION', this.view.id, tpl);

		//console.log('FUNCTION', tpl);
		//shader.use = new Function('return ' + tpl)().bind(this);
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
		// Attach the dali_obj to the shader.shader object (DALI)
		var len = this.useShader(gl, shader);
		if(len) gl.drawArrays(this.drawtype, start || 0, end === undefined?len: end)
	}

})
