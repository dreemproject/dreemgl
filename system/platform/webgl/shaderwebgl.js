/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define.class('$system/base/shader', function(require, exports){

	var gltypes = require('$system/base/gltypes')

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
	/*
	this.useShader = function(gl, shader){
		if(!shader) return
		if(shader.use) return shader.use(gl, shader, this)
		// use the shader
		gl.useProgram(shader)

		// set uniforms
		var uniset = shader.uniset
		var unilocs = shader.unilocs
		for(var key in uniset){
			var loc = unilocs[key]
			var split = loc.split
			if(split){
				for(var i = 0, prop = this; i < split.length; i ++) prop = prop[split[i]]
				if(loc.last !== prop){
					loc.last = prop
					uniset[key](gl, loc.loc, prop)
				}
			}
			else{
				var prop = this['_' + key]
				//if(this.dbg) console.log(key, prop)
				if(loc.last !== prop){
					loc.last = prop
					uniset[key](gl, loc.loc, prop)
				}
			}
		}
		// textures
		var texlocs = shader.texlocs
		var texid = 0
		for(var key in texlocs){
			var texinfo = texlocs[key]
			var split = texinfo.split
			if(split){
				for(var texture = this, i = 0; i < split.length; i ++) texture = texture[split[i]]
			}
			else{
				var texture = this['_' + texinfo.name] || this[texinfo.name]
			}
			// lets fetch the sampler
			var gltex = texture[texinfo.samplerid]
			// lets do the texture slots correct
			if(!gltex){
				gltex = texture.createGLTexture(gl, texid, texinfo)
				if(!gltex){
					gltex = this.default_texture.createGLTexture(gl, texid, texinfo)
				}
			}
			else{
				gl.activeTexture(gl.TEXTURE0 + texid)
				gl.bindTexture(gl.TEXTURE_2D, gltex)
				if(texture.updateid !== gltex.updateid){
					texture.updateGLTexture(gl, gltex)
				}
			}
			gl.uniform1i(texinfo.loc, texid)
			texid++
		}

		// set attributes
		var attrlocs = shader.attrlocs
		var len = 0 // pull the length out of the buffers
		var lastbuf
		for(var key in attrlocs){
			var attrloc = attrlocs[key]

			if(attrloc.name){
				var buf = this['_' + attrloc.name]
			}
			else{
				var buf = this['_' + key]
			}

			if(lastbuf !== buf){
				lastbuf = buf
				if(!buf.glvb) buf.glvb = gl.createBuffer()
				if(buf.length > len) len = buf.length
				gl.bindBuffer(gl.ARRAY_BUFFER, buf.glvb)
				if(!buf.clean){
					gl.bufferData(gl.ARRAY_BUFFER, buf.array.buffer, gl.STREAM_DRAW )
					buf.clean = true
				}
			}
			var loc = attrloc.loc
			gl.enableVertexAttribArray(loc)

			if(attrloc.name){ // ok so. lets set the vertexAttribPointer
				gl.vertexAttribPointer(loc, attrloc.slots, gl.FLOAT, false, buf.stride, attrloc.offset)
			}
			else{
				gl.vertexAttribPointer(loc, buf.slots, gl.FLOAT, false, buf.stride, 0)
			}
		}

		// set up blend mode
		if(this.alpha_blend_eq.op){
			var constant = this.constant
			if(constant) gl.blendColor(constant[0], constant[1], constant[2], constant.length>3?constant[3]:1)
			gl.enable(gl.BLEND)
			gl.blendEquationSeparate(this.color_blend_eq.op, this.alpha_blend_eq.op)
			gl.blendFuncSeparate(
				this.color_blend_eq.src,
				this.color_blend_eq.dst,
				this.alpha_blend_eq.src,
				this.alpha_blend_eq.dst
			)
		}
		else if(this.color_blend_eq.op){
			var constant = this.constant
			if(constant) gl.blendColor(constant[0], constant[1], constant[2], constant.length>3?constant[3]:1)
			gl.enable(gl.BLEND)
			gl.blendEquation(this.color_blend_eq.op)
			gl.blendFunc(this.color_blend_eq.src, this.color_blend_eq.dst)
		}
		else{
			gl.disable(gl.BLEND)
		}
		// set up depth test
		if(this.depth_test_eq.func > 1){
			gl.enable(gl.DEPTH_TEST)
			gl.depthFunc(this.depth_test_eq.func)
		}
		else{
			gl.disable(gl.DEPTH_TEST)
		}
		
		return len
	}*/

	//this.compile_use = true

	this.useShaderTemplate = function(gldevice, shader, root, overlay){
		var gl = gldevice.gl
		var ANGLE_instanced_arrays = gldevice.ANGLE_instanced_arrays
		// use the shader
		gl.useProgram(shader)

		// set uniforms
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
			if(!gltex) return 0
			gltex.updateid = texture.updateid
		}
		else{
			gl.activeTexture(TEXTUREGL_ID) // gl.TEXTURE0 + TEXTURE_ID
			gl.bindTexture(gl.TEXTURE_2D, gltex)
			if(texture.updateid !== gltex.updateid){
				texture.updateGLTexture(gl, gltex)
			}
		}
		gl.uniform1i(TEXTURE_LOC, TEXTURE_ID)
		if(TEXTURE_ID > 0)debugger
		TEXTURE_END

		// attributes
		var len = 0 // pull the length out of the buffers
		var lastbuf
		ATTRLOC_START
		var buf = ATTRLOC_BUF
		if (!buf) return 0;
		if(lastbuf !== buf){
			lastbuf = buf
			if(buf.length === 0) return 0
			if(!buf.glvb) buf.glvb = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buf.glvb)
			if(!buf.clean){
				var dt = Date.now()
				gl.bufferData(gl.ARRAY_BUFFER, buf.array, gl.STATIC_DRAW)
				buf.clean = true
			}
		}
		var loc = ATTRLOC_LOC
		gl.enableVertexAttribArray(loc)
		ATTRLOC_ATTRIBPTR
		if(buf.instancedivisor){
			ANGLE_instanced_arrays.vertexAttribDivisorANGLE(loc, buf.instancedivisor)
			root.instance_len = buf.length
		}
		else{
			ANGLE_instanced_arrays.vertexAttribDivisorANGLE(loc, 0)
			len = buf.length
		}
		ATTRLOC_END

		// set up blend mode
		if(root.alpha_blend_eq.op){
			var constant = root.constant
			if(constant) gl.blendColor(constant[0], constant[1], constant[2], constant.length>3? constant[3]: 1)
			gl.enable(gl.BLEND)
			gl.blendEquationSeparate(root.color_blend_eq.op, root.alpha_blend_eq.op)
			gl.blendFuncSeparate(
				root.color_blend_eq.src,
				root.color_blend_eq.dst,
				root.alpha_blend_eq.src,
				root.alpha_blend_eq.dst
			)
		}
		else if(root.color_blend_eq.op){
			var constant = root.constant
			if(constant) gl.blendColor(constant[0], constant[1], constant[2], constant.length>3? constant[3]: 1)
			gl.enable(gl.BLEND)
			gl.blendEquation(root.color_blend_eq.op)
			gl.blendFunc(root.color_blend_eq.src, root.color_blend_eq.dst)
		}
		else{
			gl.disable(gl.BLEND)
		}
		
		// set up depth test
		if(root.depth_test_eq.func > 1){
			//console.log(root.depth_test_eq)
			gl.enable(gl.DEPTH_TEST)
			gl.depthFunc(root.depth_test_eq.func)
		}
		else{
			gl.disable(gl.DEPTH_TEST)
		}
		
		return len
	}

	this.compileUse = function(shader){
		// alright lets compile our useShader from 
		var tpl = this.useShaderTemplate.toString()
		tpl = tpl.replace(/^function/, "function useshader_" + (this.view?this.view.constructor.name:'anonymous') + '_shader_' + this.constructor.name)
		// ok lets replace shit.
		// set uniforms
		var out = 'var loc, uni\n'
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
				out += '\t\tuni = "'+key+'" in overlay?overlay.'+key+':root.' + name + '\n'
			}
			else{
				out += '\t\tuni = "'+key+'" in overlay?overlay.'+key+':root.' 
				if(isattr) out += '_' 
				out += key + '\n'
			}
			// put in a bailout when we doing have the pixel entry
			if(key === '_pixelentry'){
				out += 'if(uni<0 || uni >'+this._pixelentries.length+') return 0\n'
			}

			out += '\t\tloc = shader.unilocs.' + key + '\n'
			var gen = gltypes.uniform_gen[loc.type]

			var call = gen.call

			out += 'gl.' + gen.call + '(loc.loc'

			if(gen.mat) out += ', false'

			if(gen.args == 1) out += ',uni)\n'
			if(gen.args == 2) out += ',uni[0], uni[1])\n'
			if(gen.args == 3) out += ',uni[0], uni[1], uni[2])\n'
			if(gen.args == 4) out += ',uni[0], uni[1], uni[2], uni[3])\n'
			if(gen.args === this.loguni) out += 'if(typeof uni === "number")console.log(uni)\n'
		}
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
					.replace(/TEXTURE_SAMPLER/, texinfo.samplerid)
					.replace(/TEXTURE_ID/g, texid)
					.replace(/TEXTURE_LOC/, 'shader.texlocs.' + key+ '.loc')
					.replace(/TEXTURE_INFO/, 'shader.texlocs.' + key)
					.replace(/TEXTUREGL_ID/g, gltypes.gl.TEXTURE0 + texid)

				texid++
			}
			return out
		})

		tpl = tpl.replace(/ATTRLOC\_START([\S\s]*)ATTRLOC\_END/, function(m){
			var body = m.slice(13,-11)
			var out = ''
			var attrlocs = shader.attrlocs
			var len = 0 // pull the length out of the buffers
			var lastbuf
			for(var key in attrlocs){
				var attrloc = attrlocs[key]
				if(!attrloc){
					continue
				}
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
						'gl.vertexAttribPointer(loc, buf.slots, gl.FLOAT, false, buf.stride, 0)'
				}
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

		shader.use = new Function('return ' + tpl)()
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
		return len
	}

})