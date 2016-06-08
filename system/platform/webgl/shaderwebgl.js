/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define.class('$system/platform/base/shader', function(require, exports){

	var gltypes = require('$system/platform/base/gltypes')

	exports.Texture =
	this.Texture =  require('./texturewebgl')

	this.compileShader = function(gldevice){
		var vtx_state = this.vtx_state
		var pix_state = this.pix_state
		var vtx_code = vtx_state.code

		var pix_color = pix_state.code_color
		var pix_pick = pix_state.code_pick
		var pix_debug = pix_state.code_debug

		var gl = gldevice.gl
		var cache_id = vtx_code + pix_color

		var shader = gldevice.shadercache[cache_id]

		if(shader) return shader

		var vtx_shader = gl.createShader(gl.VERTEX_SHADER)
		gl.shaderSource(vtx_shader, vtx_code)
		gl.compileShader(vtx_shader)
		if (!gl.getShaderParameter(vtx_shader, gl.COMPILE_STATUS)){
			var err = gl.getShaderInfoLog(vtx_shader)
			console.error(err.toString(), this.annotateLines(vtx_code))
			return
			//throw new Error(err)
		}
		
		// compile the shader
		var pix_color_shader = gl.createShader(gl.FRAGMENT_SHADER)
		gl.shaderSource(pix_color_shader, pix_color)
		gl.compileShader(pix_color_shader)
		if (!gl.getShaderParameter(pix_color_shader, gl.COMPILE_STATUS)){
			var err = gl.getShaderInfoLog(pix_color_shader)

			console.error(err.toString(), this.annotateLines(pix_color))
			return
			//throw new Error(err)
		}

		shader = gldevice.shadercache[cache_id] = gl.createProgram()
		gl.attachShader(shader, vtx_shader)
		gl.attachShader(shader, pix_color_shader)
		gl.linkProgram(shader)
		if (!gl.getProgramParameter(shader, gl.LINK_STATUS)){
			var err = gl.getProgramInfoLog(shader)

			console.error(err.toString(), this.annotateLines(pix_color))
			return
			//throw new Error(err)
		}

		this.getLocations(gl, shader, vtx_state, pix_state)

		this.compileUse(shader)

		return shader		
	}
	
	this.compileUse = function(shader){

		// alright lets compile our useShader from 
		var code = ''

		code += 'var gl = gldevice.gl\n'
		code += 'var ANGLE_instanced_arrays = gldevice.ANGLE_instanced_arrays\n'
		code += 'gl.useProgram(shader)\n'

		/// lets do the uniform code
		var shadername = "useshader_" + (this.view?this.view.constructor.name:'anonymous') + '_shader_' + this.constructor.name

		// set uniforms
		code += 'var loc, uni\n'
		var uniset = shader.uniset
		var unilocs = shader.unilocs
		var refattr = shader.refattr

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
				code += 'uni = "'+key+'" in overlay?overlay.'+key+':root.' + name + '\n'
			}
			else{
				code += 'uni = "'+key+'" in overlay?overlay.'+key+':root.' 
				if(isattr) code += '_' 
				code += key + '\n'
			}
			// put in a bailout when we doing have the pixel entry
			if(key === '_pixelentry'){
				code += 'if(uni<0 || uni >'+this._pixelentries.length+') return 0\n'
			}

			code += 'loc = shader.unilocs.' + key + '\n'
			var gen = gltypes.uniform_gen[loc.type]

			var call = gen.call

			code += 'gl.' + gen.call + '(loc.loc'

			if(gen.mat) code += ', false'

			if(gen.args == 1) code += ',uni)\n'
			if(gen.args == 2) code += ',uni[0], uni[1])\n'
			if(gen.args == 3) code += ',uni[0], uni[1], uni[2])\n'
			if(gen.args == 4) code += ',uni[0], uni[1], uni[2], uni[3])\n'
			if(gen.args === this.loguni) code += 'if(typeof uni === "number")console.log(uni)\n'
		}

		var texlocs = shader.texlocs
		var texid = 0
		for(var key in texlocs){
			var texinfo = texlocs[key]
			var split = texinfo.split

			var texture_prop =''
			if(split){
				texture_prop = 'root.' + split.join('.')
			}
			else{
				texture_prop = 'root.' + texinfo.name
			}

			code += 'var texture = '+texture_prop+'\n'
			code += 'var gltex = texture.'+texinfo.samplerid+'\n'
			code += 'if(!gltext){\n'
			code += '	if(!texture.createGLTexture) texture = '+texture_prop+' = root.Texture.fromStub(texture, gldevice)\n'
			code += '	gltex = texture.createGLTexture('+texid+', shader.texlocs.'+key+', gldevice)\n'
			code += '	if(!gltex) return 0\n'
			code += '	gltex.updateid = texture.updateid\n'
			code += '}\n'
			code += 'else{\n'
			code += '	gl.activeTexture(' + gltypes.gl.TEXTURE0+texid+')\n'
			code += '	gl.bindTexture('+gltypes.gl.TEXTURE_2D+', gltext)\n'
			code += '	if(texture.updateid !== gltex.updateid){\n'
			code += '		texture.updateGLTexture(gl, gltex)\n'
			code += '	}\n'
			code += '}\n'
			code += 'gl.uniforms1i(shader.texlocs.' + key + '.loc, '+texid+')\n'

			texid++
		}

		// attributes
		var attrlocs = shader.attrlocs
		var len = 0 // pull the length out of the buffers
		var lastbuf
		for(var key in attrlocs){
			// key geometry ... props
			var attrloc = attrlocs[key]
			if(!attrloc){
				continue
			}

			var propname
			if(attrloc.name === 'props') propname = 'root._propsbuffer'
			else propname = 'root._' + attrloc.name

			code += 'var buf = '+propname+'\n'
			if(lastbuf !== propname){
				lastbuf = propname
				code += 'if(buf.length === 0) return 0\n'
				code += 'if(!buf.glvb) buf.glvb = gl.createBuffer()\n'
				code += 'gl.bindBuffer('+gltypes.gl.ARRAY_BUFFER+', buf.glvb)\n'
				code += 'if(!buf.clean){\n'
				code += '	gl.bufferData('+gltypes.gl.ARRAY_BUFFER+', buf.array, '+gltypes.gl.STATIC_DRAW+')\n'
				code += '	buf.clean = true\n'
				code += '}\n'
			}
			code += 'var loc = shader.attrlocs.'+key+'.loc\n'
			code += 'gl.enableVertexAttribArray(loc)\n'
			code += 'gl.vertexAttribPointer(loc, '+attrloc.slots+', gl.FLOAT, false, buf.stride, '+attrloc.offset+')\n'
			code += 'if(buf.instancedivisor){\n'
			code += '	ANGLE_instanced_arrays.vertexAttribDivisorANGLE(loc, buf.instancedivisor)\n'
			code += '	root.instance_len = buf.length\n'
			code += '}\n'
			code += 'else{\n'
			code += '	ANGLE_instanced_arrays.vertexAttribDivisorANGLE(loc, 0)\n'
			code += '	len = buf.length\n'
			code += '}\n'
		}

		// set up blend mode
		code += 'if(root.alpha_blend_eq.op){\n'
		code += '	var constant = root.constant\n'
		code += '	if(constant) gl.blendColor(constant[0], constant[1], constant[2], constant.length>3? constant[3]: 1)\n'
		code += '	gl.enable('+gltypes.gl.BLEND+')\n'
		code += '	gl.blendEquationSeparate(root.color_blend_eq.op, root.alpha_blend_eq.op)\n'
		code += '	gl.blendFuncSeparate(\n'
		code += '		root.color_blend_eq.src,\n'
		code += '		root.color_blend_eq.dst,\n'
		code += '		root.alpha_blend_eq.src,\n'
		code += '		root.alpha_blend_eq.dst\n'
		code += '	)\n'
		code += '}\n'
		code += 'else if(root.color_blend_eq.op){\n'
		code += '	var constant = root.constant\n'
		code += '	if(constant) gl.blendColor(constant[0], constant[1], constant[2], constant.length>3? constant[3]: 1)\n'
		code += '	gl.enable('+gltypes.gl.BLEND+')\n'
		code += '	gl.blendEquation(root.color_blend_eq.op)\n'
		code += '	gl.blendFunc(root.color_blend_eq.src, root.color_blend_eq.dst)\n'
		code += '}\n'
		code += 'else{\n'
		code += '	gl.disable('+gltypes.gl.BLEND+')\n'
		code += '}'

		// set up depth test
		code += 'if(root.depth_test_eq.func > 1){\n'
		code += '	gl.enable('+gltypes.gl.DEPTH_TEST+')\n'
		code += '	gl.depthFunc(root.depth_test_eq.func)\n'
		code += '}\n'
		code += 'else{\n'
		code += '	gl.disable('+gltypes.gl.DEPTH_TEST+')\n'
		code += '}\n'
		code += 'console.log("HURRAH", len)\n'

		code += 'return len\n'

		shader.use = new Function('return function '+shadername+'(gldevice, shader, root, overlay){'+code+'}')()
	}

	// all draw types
	exports.TRIANGLES = this.TRIANGLES = 0x4
	exports.LINES = this.LINES = 0x1
	exports.LINE_LOOP = this.LINE_LOOP = 0x2
	exports.LINE_STRIP = this.LINE_STRIP = 0x3
	exports.TRIANGLE_STRIP = this.TRIANGLE_STRIP = 0x5
	exports.TRIANGLE_FAN = this.TRIANGLE_FAN = 0x6

	this.drawtype_enum = this.TRIANGLES
	Object.defineProperty(this, 'drawtype', {set:function(v){
		if(typeof v === 'string') this.drawtype_enum = this[v]
		else this.drawtype_enum = v
	}})

	// lets draw ourselves
	this.draw = function(gldevice, overlay){
		//if(this.mydbg) debugger
		if(!this.hasOwnProperty('shader') || this.shader === undefined) this.compile(gldevice)
		var shader = this.shader
		if(!shader) return

		var len = shader.use(gldevice, shader, this, overlay)
		if(len){
			if(this.index){
				if(this.instance_len){
					gldevice.ANGLE_instanced_arrays.drawElementsInstancedANGLE(this.drawtype_enum, this.start || 0, this.end === undefined?len: this.end)
				}
				else{
					gl.drawElements(this.drawtype_enum, this.start || 0, this.end === undefined?len: this.end)
				}
			}
			else{				
				if(this.instance_len){
					gldevice.ANGLE_instanced_arrays.drawArraysInstancedANGLE(this.drawtype_enum, this.start || 0, this.end === undefined?len: this.end, this.instance_len)
				}
				else{
					gl.drawArrays(this.drawtype_enum, start || 0, end === undefined?len: end)
				}
			}
		}
		if(this.atDraw) this.atDraw(len)
		return len
	}

})