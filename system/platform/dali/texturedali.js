/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$system/base/texture', function(exports){
	var Texture = exports

	this.atConstructor = function(type, w, h, device){
		this.device = device
		this.type = type
		this.size = vec2(w, h)
	}

	this.ratio = 1
	this.frame_buf = null

	Texture.fromType = function(type){
		return new Texture(type,0,0)
	}

	Texture.fromImage = function(img){
		var tex = new Texture('rgba', img.width, img.height)
		tex.image = img
		return tex
	}

	Texture.fromArray = function(array, w, h){
		var tex = new Texture('rgba', w, h)
		tex.array = array
		return tex
	}

	Texture.createRenderTarget = function(type, width, height, device){
		var tex = new Texture(type, width, height, device)
		tex.initAsRendertarget()
		return tex
	}

	// type flags
	Texture.RGB = 1 <<0
	Texture.RGBA = 1 << 1
	Texture.ALPHA = 1 << 3
	Texture.DEPTH = 1 << 4
	Texture.STENCIL = 1 << 5
	Texture.LUMINANCE = 1<< 6

	Texture.FLOAT = 1<<10
	Texture.HALF_FLOAT = 1<<11
	Texture.FLOAT_LINEAR = 1<<12
	Texture.HALF_FLOAT_LINEAR = 1<<13

	this.typeString = function(){
		var str = ''
		for(var key in Texture){
			var value = Texture[key]
			if(typeof value === 'number' && value & this.type){
				if(str) str += '|'
				str +=  'Texture.'+key
			}
		}
		return str
	}

	this.initAsRendertarget = function(){
		var gl = this.device.gl
		
		if(!this.type) this.type = Texture.RGBA|Texture.DEPTH|Texture.STENCIL
		var type = this.type

		this.glframe_buf = gl.createFramebuffer()
		this.gltex = this.IL_AL_SC_TC = gl.createTexture()

		// our normal render to texture thing
		gl.bindTexture(gl.TEXTURE_2D, this.gltex)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

		this.glbuf_type = gl.RGB
		if(type & Texture.LUMINANCE){
			this.glbuf_type = gl.LUMINANCE
			if(type & TEXTURE.ALPHA) this.glbuf_type = gl.LUMINANCE_ALPHA
		}
		else if(type & Texture.ALPHA) this.glbuf_type = gl.ALPHA
		else if(type & Texture.RGBA) this.glbuf_type = gl.RGBA

		this.gldata_type = gl.UNSIGNED_BYTE
		if(type & Texture.HALF_FLOAT_LINEAR){
			var ext = gl._getExtension('OES_texture_half_float_linear')
			if(!ext) throw new Error('No OES_texture_half_float_linear')
			this.gldata_type = ext.HALF_FLOAT_LINEAR_OES
		}
		else if(type & Texture.FLOAT_LINEAR){
			var ext = gl._getExtension('OES_texture_float_linear')
			if(!ext) throw new Error('No OES_texture_float_linear')
			this.gldata_type = ext.FLOAT_LINEAR_OES
		}
		else if(type & Texture.HALF_FLOAT){
			var ext = gl._getExtension('OES_texture_half_float')
			if(!ext) throw new Error('No OES_texture_half_float')
			this.gldata_type = ext.HALF_FLOAT_OES
		}
		else if(type & Texture.HALF_FLOAT){
			var ext = gl._getExtension('OES_texture_float')
			if(!ext) throw new Error('No OES_texture_float')
			this.gldata_type = gl.FLOAT
		}

		gl.texImage2D(gl.TEXTURE_2D, 0, this.glbuf_type, this.size[0], this.size[1], 0, this.glbuf_type, this.gldata_type, null)
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.glframe_buf)
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.gltex, 0)

		if(type & Texture.DEPTH || type & Texture.STENCIL){
			this.gldepth_buf = gl.createRenderbuffer()
	
			this.gldepth_type = gl.DEPTH_COMPONENT16
			this.glattach_type = gl.DEPTH_ATTACHMENT

			if(type & Texture.DEPTH && type & Texture.STENCIL){
				this.gldepth_type = gl.DEPTH_STENCIL
				this.glattach_type = gl.DEPTH_STENCIL_ATTACHMENT
			}
			else if(type & Texture.STENCIL){
				this.gldepth_type = gl.STENCIL_INDEX
				this.glattach_type = gl.STENCIL_ATTACHMENT
			}
			gl.bindRenderbuffer(gl.RENDERBUFFER, this.gldepth_buf)
			gl.renderbufferStorage(gl.RENDERBUFFER, this.gldepth_type, this.size[0], this.size[1])
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, this.glattach_type, gl.RENDERBUFFER, this.gldepth_buf)

			gl.bindRenderbuffer(gl.RENDERBUFFER, null)
		}
		gl.bindTexture(gl.TEXTURE_2D, null)
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	}
	
	this.delete = function(){
		if(!this.device) return
		var gl = this.device.gl
		if(this.glframe_buf){
			gl.deleteFramebuffer(this.glframe_buf)
			this.glframe_buf = undefined
		}
		if(this.gltex){
			gl.deleteTexture(this.gltex)
			this.gltex = undefined
		}
		if(this.depth_buf){
			gl.deleteRenderbuffer(this.gldepth_buf)
		}
	}

	this.resize = function(width, height){
		this.delete
		this.size = vec2(width, height)
		this.initAsRendertarget()
	}

	this.size = vec2(0, 0)
	
	this.createGLTexture = function(gl, texid, texinfo){
		var samplerid = texinfo.samplerid

		if(this.image && this.image[samplerid]){
			this[samplerid] = this.image[samplerid]
		}

		var gltex = this[samplerid]
		if(gltex){
			gl.activeTexture(gl.TEXTURE0 + texid)
			gl.bindTexture(gl.TEXTURE_2D, gltex)
			return gltex
		}

		var samplerdef = texinfo.samplerdef
		var gltex = gl.createTexture()
		gl.activeTexture(gl.TEXTURE0 + texid)
		gl.bindTexture(gl.TEXTURE_2D, gltex)
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, samplerdef.UNPACK_FLIP_Y_WEBGL || false)
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, samplerdef.UNPACK_PREMULTIPLY_ALPHA_WEBGL || false)

		if(this.array){
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size[0], this.size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.array))
		}
		else if(this.image){
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
			this.image[samplerid] = gltex
		}
		else{
			return undefined
		}
		
		gltex.updateid = this.updateid
		// set up sampler parameters
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[samplerdef.MIN_FILTER])
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[samplerdef.MAG_FILTER])

		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[samplerdef.WRAP_S])
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[samplerdef.WRAP_T])

		this[samplerid] = gltex
		return gltex
	}

	this.updateGLTexture = function(gl, gltex){
		if(this.array){
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.size[0], this.size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.data)) 
		}
		else if(this.image){
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
		}
		gltex.updateid = this.updateid
	}

	// Shders
	this.sample2 = function(x, y){ return sample(vec2(x, y)) }
	this.sample = function(v){
		return texture2D(this, v, {
			MIN_FILTER: 'LINEAR',
			MAG_FILTER: 'LINEAR',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.flipped2 = function(x,y){ return flipped(vec2(x,y)) }
	this.flipped = function(v){
		return texture2D(this, vec2(v.x, 1. - v.y), {
			MIN_FILTER: 'LINEAR',
			MAG_FILTER: 'LINEAR',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.point2 = function(x, y){ return point(vec2(x, y)) }
	this.point = function(v){
		return texture2D(this, vec2(v.x, v.y), {
			MIN_FILTER: 'NEAREST',
			MAG_FILTER: 'NEAREST',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

	this.point_flipped2 = function(x, y){ return point_flipped(vec2(x, y)) }
	this.point_flipped = function(v){
		return texture2D(this, vec2(v.x, 1. - v.y), {
			MIN_FILTER: 'NEAREST',
			MAG_FILTER: 'NEAREST',
			WRAP_S: 'CLAMP_TO_EDGE',
			WRAP_T: 'CLAMP_TO_EDGE'
		})
	}

})