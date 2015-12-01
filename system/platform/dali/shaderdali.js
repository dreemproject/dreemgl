/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class('../shader', function(require, exports, self){
	//if(define.$environment === 'nodejs') return

	var gltypes = require('../gltypes')

	var Texture = require('./texturedali')

	this.Texture = Texture

	this.compileShader = function(gldevice){
		var vtx_state = this.vtx_state
		var pix_state = this.pix_state
		var vtx_code = vtx_state.code

		var pix_color = pix_state.code_color

		var pix_pick = pix_state.code_pick
		var pix_debug = pix_state.code_debug

		var gl = gldevice.gl
		var cache_id = vtx_code + pix_color + this.has_pick
		var shader = gldevice.shadercache[cache_id]

		if(shader) return shader

	    //HACK to simulator shader
	    shader = {
		debug: {}
		,pick: {}

		,uniset: {}
		,unilocks: {}
		,refattr: {}
	    };

	    //console.log('**** vtx_shader', vtx_code);
	    //console.log('**** pix_shader', pix_color);

	    //TODO
		//var vtx_shader = gl.createShader(gl.VERTEX_SHADER)
		//gl.shaderSource(vtx_shader, vtx_code)
		//gl.compileShader(vtx_shader)
		//if (!gl.getShaderParameter(vtx_shader, gl.COMPILE_STATUS)){
		//	var err = gl.getShaderInfoLog(vtx_shader)
		//	console.log(err.toString(), this.annotateLines(vtx_code))
		//	throw new Error(err)
		//}
		
		// compile the shader
		//var pix_color_shader = gl.createShader(gl.FRAGMENT_SHADER)
		//gl.shaderSource(pix_color_shader, pix_color)
		//gl.compileShader(pix_color_shader)
		//if (!gl.getShaderParameter(pix_color_shader, gl.COMPILE_STATUS)){
		//	var err = gl.getShaderInfoLog(pix_color_shader)

		//	console.log(err.toString(), this.annotateLines(pix_color))
		//	throw new Error(err)
		//}

		//shader = gldevice.shadercache[cache_id] = gl.createProgram()
		//gl.attachShader(shader, vtx_shader)
		//gl.attachShader(shader, pix_color_shader)
		//gl.linkProgram(shader)
		this.getLocations(gl, shader, vtx_state, pix_state)

		if(this.compile_use) this.compileUse(shader)

		if(pix_debug){
		    //console.log('**** pix_debug shader', pix_debug);
			// compile the pick shader
			//var pix_debug_shader = gl.createShader(gl.FRAGMENT_SHADER)
			//gl.shaderSource(pix_debug_shader, pix_debug)
			//gl.compileShader(pix_debug_shader)
			//if (!gl.getShaderParameter(pix_debug_shader, gl.COMPILE_STATUS)){
			//	var err = gl.getShaderInfoLog(pix_debug_shader)
			//	console.log(err.toString(), this.annotateLines(pix_debug))
			//	throw new Error(err)
			//}

			//shader.debug = gl.createProgram()
			//gl.attachShader(shader.debug, vtx_shader)
			//gl.attachShader(shader.debug, pix_debug_shader)
			//gl.linkProgram(shader.debug)
			// add our pick uniform
			this.getLocations(gl, shader.debug, vtx_state, pix_state)
			if(this.compile_use) this.compileUse(shader.debug)
		}

		if(this.has_pick){
		    //console.log('**** pix_pick shader', pix_pick);
			// compile the pick shader
			//var pix_pick_shader = gl.createShader(gl.FRAGMENT_SHADER)
			//gl.shaderSource(pix_pick_shader, pix_pick)
			//gl.compileShader(pix_pick_shader)
			//if (!gl.getShaderParameter(pix_pick_shader, gl.COMPILE_STATUS)){
			//	var err = gl.getShaderInfoLog(pix_pick_shader)

			//	console.log(err.toString(), this.annotateLines(pix))
			//	throw new Error(err)
			//}

			//shader.pick = gl.createProgram()
			//gl.attachShader(shader.pick, vtx_shader)
			//gl.attachShader(shader.pick, pix_pick_shader)
			//gl.linkProgram(shader.pick)
			// add our pick uniform
			pix_state.uniforms['pick'] = vec3

			this.getLocations(gl, shader.pick, vtx_state, pix_state)

			if(this.compile_use) this.compileUse(shader.pick)
		}

		return shader		
	}

	this.useShader = function(gl, shader){
		if(shader.use) return shader.use(gl, shader, this)
		// use the shader
	    //TODO
		//gl.useProgram(shader)

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
				//gl.activeTexture(gl.TEXTURE0 + texid)
				//gl.bindTexture(gl.TEXTURE_2D, gltex)
				if(texture.updateid !== gltex.updateid){
					texture.updateGLTexture(gl, gltex)
				}
			}
			//gl.uniform1i(texinfo.loc, texid)
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
					gl.bufferData(gl.ARRAY_BUFFER, buf.array.buffer, gl.STATIC_DRAW)
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
		if(this.depth_test_eq.func){
			gl.enable(gl.DEPTH_TEST)
			gl.depthFunc(this.depth_test_eq.func)
		}
		else{
			gl.disable(gl.DEPTH_TEST)
		}
		
		return len
	}

	this.compile_use = true

	this.useShaderTemplate = function(gl, shader, root){
	    //TODO
	}

	this.compileUse = function(shader){
		// alright lets compile our useShader from 
		var tpl = this.useShaderTemplate.toString()
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
					if(isattr && i === split.length - 1) name += '_'
					name += split[i]
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
					.replace(/TEXTURE_VALUE/, TEXTURE_VALUE)
					.replace(/TEXTURE_SAMPLER/, texinfo.samplerid)
					.replace(/TEXTURE_ID/g, texid)
					.replace(/TEXTURE_LOC/, 'shader.texlocs.' + key+ '.loc')
					.replace(/TEXTURE_INFO/, 'shader.texlocs.' + key)
					.replace(/TEXTUREGL_ID/, gltypes.gl.TEXTURE0 + texid)
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

	//this.draw_type = 'TRIANGLES'//POINTS:0x0,LINES:0x1,LINE_LOOP:0x2,LINE_STRIP:0x3,TRIANGLES:0x4,TRIANGLE_STRIP:0x5,TRIANGLE_FAN:0x6
	
	// lets draw ourselves
	this.drawArrays = function(devicedali, sub, start, end){
		//if(this.mydbg) debugger
		if(!this.hasOwnProperty('shader') || this.shader === undefined) this.compile(devicedali)
		var gl = devicedali.gl
		var len = this.useShader(gl, sub? this.shader[sub]: this.shader)
		gl.drawArrays(this._draw_type_gl, start || 0, end === undefined?len: end)
	}

})
