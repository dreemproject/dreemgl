/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	// mixins / external deps
	var CanvasLayout = require('$base/canvaslayout')
	for(var key in CanvasLayout.prototype) this[key] = CanvasLayout.prototype[key]
	exports.compileCanvasVerbs = require('$base/canvasverbcompiler').prototype.compileCanvasVerbs

	this.Shader = require('$base/shader')
	this.Texture = require('$base/texture')

	this.initCanvas = function(view){
		this.view = view
		this.scope = view
		this.matrix = mat4.identity()
		this.cmds = []
		this.shadernames = []
		this.stackAlign = []
		this.trackAlign = []
		this.matrixStack = [this.matrix]
		this.matrixStackLen = 0
		this.align = this.stackAlign[0] = {x:0, y:0, w:0, h:0, flags:this.LEFT, total:0}
	}

	this.clearCmds = function(){
		this.cmds.length = 0
		this.stackAlign.len = 0
		this.trackAlign.length = 0
		this.shadernames.length = 0
		this.matrixStackLen = 0
		var o = this.matrix
		o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0,
		o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0,
		o[8] = 0, o[9] = 0, o[10]= 1, o[11]= 0,
		o[12]= 0, o[13]= 0, o[14]= 0, o[15]= 1
		this.x = undefined
		this.y = undefined
		this.w = this.width
		this.h = this.height
		this.align = this.stackAlign[0]
		this.beginAlign(float.TOPLEFT, float.WRAP, this.view.padding)
	}

	// readpixel
	this.readPixels = function(x, y, w, h, buffer){
		return new define.Promise(function(resolve, reject){
			this.cmds.push('readPixels', {x:x,y:y,w:w,h:h, buffer:buffer, resolve:resolve})
		}.bind(this))
	}

	this.addCanvas = function(ctx, index){
		ctx.trackAlign = this.trackAlign
		ctx.stackAlign = this.stackAlign
		//console.log(this.align.w)
		ctx.width = this.width
		ctx.height = this.height
		ctx.frameid = this.frameid
		ctx.target = this.target
		ctx.has_view_matrix_set = this.has_view_matrix_set
		this.cmds.push('canvas', ctx.cmds, ctx.view)
	}

	this.clear = function(r, g, b ,a){
		var color = r
		if(typeof r === 'string') color = vec4(r)
		if(r !== undefined && g !== undefined) color = [r,g,b,a]
		this.cmds.push('clear', color !== undefined?color:this.scope.clearcolor)
	}

	this.startCache = function(uid, isdirty){
		if(!this.cachestack) this.cachestack = []
		if(isdirty || !this.view.draw_cache || !this.view.draw_cache[uid]){
			this.cachestack.push(this.cmds.length, uid)
			return true
		}
		// restore cache
		var cache = this.view.draw_cache[uid]
		this.cmds.push.apply(this.cmds, cache.cmds)
		this.view.pickdraw = cache.pickdraw
		return false
	}
	
	this.stopCache = function(){
		if(!this.cachestack || !this.cachestack.length) throw new Error('no matching pushcache')
		var uid = this.cachestack.pop()
		var pos = this.cachestack.pop()
		if(!this.view.draw_cache) this.view.draw_cache = {}
		this.view.draw_cache[uid] = {
			cmds:this.cmds.slice(pos, this.cmds.length), 
			pickdraw:this.view.pickdraw
		}
	}
	
	this.drawShaderCmd = function(shader, buffer){
		if(!this.has_view_matrix_set){
			if(this.target.flags&this.DEPTH){
				this.setPerspectiveViewMatrix()
			}
			else{
				this.setOrthoViewMatrix()
			}
		}
		shader.view = this.view
		shader._canvasprops = buffer
		this.cmds.push(
			'drawShader',
			shader
		)
	}

	// create or reuse a matrix by name
	this.getMatrix = function(name, itarget){
		var target = itarget !== undefined? itarget: this.target.targetguid
		var store = this.view.matrix_store[target]
		if(!store) this.view.matrix_store[target] = store = {}
		var mat = store[name]
		if(!mat) store[name] = mat = mat4()
		return mat
	}

	// load a matrix (return undefined when not there)
	this.loadMatrix = function(name, itarget){
		var target = itarget !== undefined? itarget: this.target.targetguid
		var store = this.view.matrix_store[target]
		if(!store) return
		return store[name]
	}

	// sets the view matrix
	this.setViewMatrix = function(iviewmatrix){
		var isstring = typeof iviewmatrix === 'string'
		var viewmatrix = isstring? this.loadMatrix(iviewmatrix) : iviewmatrix
		if(!iviewmatrix) return
		this.cmds.push(
			'setViewMatrix',
			viewmatrix,
			isstring?iviewmatrix:undefined
		)
		this.has_view_matrix_set = true
	}
	
	this.setTotalMatrix = function(itotalmatrix){
		this.totalmatrix = itotalmatrix
		this.cmds.push(
			'setTotalMatrix',
			itotalmatrix
		)
	}

	// sets the view matrix to default ortho projection which is in device pixels top left 0,0
	this.setOrthoViewMatrix = function(yflip, xflip, iwidth, iheight, ixscroll, iyscroll, izoom, left, top){
		// lets set up a 2D matrix
		var width = iwidth !== undefined?iwidth:this.target.width
		var height = iheight !== undefined?iheight:this.target.height
		var zoom = izoom !== undefined?izoom: this.scope._zoom
		var xscroll = ixscroll !== undefined? ixscroll: this.scope._scroll[0]
		var yscroll = iyscroll !== undefined? iyscroll: this.scope._scroll[1]

		var viewmatrix = this.getMatrix('view')
		var L = xscroll
		var R = width * zoom + xscroll
		var T = yscroll
		var B = height * zoom + yscroll
		mat4.ortho(xflip?R:L, xflip?L:R, yflip?T:B, yflip?B:T, -100, 100, viewmatrix)

		var noscrollmatrix = this.getMatrix('noscroll')
		var L = left || 0 
		var R = width
		var T = top || 0
		var B = height
		mat4.ortho(xflip?R:L, xflip?L:R, yflip?T:B, yflip?B:T, -100, 100, noscrollmatrix)
		this.setViewMatrix(viewmatrix)
	}
	
	// set the view matrix to a perspective projection
	this.setPerspectiveViewMatrix = function(ifov, inear, ifar, icamera, ilookat, iup, iwidth, iheight){
			
		var fov = ifov !== undefined? ifov: this.scope._fov
		var camera = icamera !== undefined? icamera: this.scope._camera 
		var lookat = ilookat !== undefined? ilookat: this.scope._lookat
		var up = iup !== undefined? iup: this.scope._up
		var width = iwidth !== undefined?iwidth:this.target.width
		var height = iheight !== undefined?iheight:this.target.height
		var near = ifov !== undefined? ifov: this.scope._fov
		
		var perspectivematrix = this.getMatrix('perspective')
		var lookatmatrix = this.getMatrix('lookat')
		var viewmatrix = this.getMatrix('view')

		mat4.perspective(fov * PI * 2/360.0 , width/height, near, far, perspectivematrix)
		mat4.lookAt(camera, lookat, up, lookatmatrix)
		mat4.mat4_mul_mat4(matrix, perspectivematrix, viewmatrix)

		this.setViewMatrix(viewmatrix)
	}

	this.getDoubleTarget = function(name, iflags, iwidth, iheight){
		if(!iframes) iframes = 2
		// lets return a double buffered target which flips on every request
	}

	// Copied from texturewebgl
	this.RGB = 1 <<0
	this.RGBA = 1 << 1
	this.ALPHA = 1 << 3
	this.DEPTH = 1 << 4
	this.STENCIL = 1 << 5
	this.LUMINANCE = 1<< 6
	this.PICK = 1<<7
	this.FLOAT = 1<<10
	this.HALF_FLOAT = 1<<11
	this.FLOAT_LINEAR = 1<<12
	this.HALF_FLOAT_LINEAR = 1<<13

	this.getTarget = function(name, iflags, iwidth, iheight){
		if(typeof name !== 'string'){
			throw new Error('Please provide a string unique target identifier')
		}
		var width = iwidth !== undefined?iwidth:this.scope._layout.width
		var height = iheight !== undefined?iheight:this.scope._layout.height
		var flags = iflags !== undefined?iflags:this.RGBA
		var targetguid = this.view.guid + '_' + flags + '_'+ (name || this.cmds.length)
		var target = {targetguid:targetguid, name:name, width:width, height:height, flags:flags, frameid:this.frameid}

		// mark it for the GC
		if(!this.view.render_targets) this.view.render_targets = {}
		this.view.render_targets[targetguid] = target

		//this.cmds.push(
		//	'getTarget', 
		//	target
		//)
		return target
	}
	
	this.identity = mat4.identity()

	this.pushTarget = function(name, iflags, iwidth, iheight){
		var target = name
		if(typeof name !== 'object') target = this.getTarget(name, iflags, iwidth, iheight)

		if(!this.cmdstack) this.cmdstack = []
		this.cmdstack.push(this.totalmatrix, this.cmds, this.target)
		this.cmds = []
		this.target = target
		this.width = target.width
		this.height = target.height
		this.has_matrix_set = false
		var pass = {
			target:target, 
			cmds:this.cmds, 
			view:this.view
		}
		var draw_passes = this.view.screen.draw_passes
		var id = draw_passes.indexOf(target.targetguid)
		if(id !== -1) draw_passes.splice(id, 2)
		draw_passes.push(target.targetguid, pass)

		// also add it to pick passes
		if(target.flags & this.PICK){
			var pick_passes = this.view.screen.pick_passes
			var id = pick_passes.indexOf(target.targetguid)
			if(id === -1){
				pick_passes.push(target.targetguid, pass)
			}
		}
		// we should push the total matrix to be identity
		this.setTotalMatrix(this.identity)

		this.has_view_matrix_set = false

		return target
	}

	this.popTarget = function(){
		if(!this.cmdstack.length) throw new Error('popTarget empty')
		this.target = this.cmdstack.pop()
		this.cmds = this.cmdstack.pop()
		this.setTotalMatrix(this.cmdstack.pop())
		if(this.target){
			this.height = this.target.height
			this.width = this.target.width
		}
	}

	var staticCacheMax = 256000
	var staticCache = {}
	var staticCol = vec4()
	this.parseColor = function(col, stc){
		if(stc){
			var out = staticCache[col]
			if(out) return out 
			if(!staticCacheMax){
				return vec4.parse(col, true, staticCol)
			}
			staticCacheMax--
			return staticCache[col] = vec4.parse(col, undefined, true)
		}
		return vec4.parse(col, undefined, true)
	}

})