/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, baseclass){
	// internal, drawing
	var Shader = require('./shaderwebgl')

	this.atConstructor = function(gldevice, view){
		this.device = gldevice
		this.view = view
		view.drawpass = this
		// lets do the flatten
		this.pickmatrices = {
			viewmatrix: mat4.identity(),
			noscrollmatrix: mat4.identity()
		}

		this.colormatrices = {
			viewmatrix: mat4.identity(),
			noscrollmatrix: mat4.identity()
		}

		this.debugrect = new DebugRect()
	}

	this.atDestroy = function(){
		this.releaseTexture()
	}

	this.poolDrawTargets = function(){
		var pools = this.device.drawtarget_pools
		if(!this.drawtargets) return
		for(var i = 0; i < this.drawtargets.length; i ++){
			var dt = this.drawtargets[i]
			if(!pools[dt]) pools[dt] = []
			pools[dt].push(this[dt])
			this[dt] = null
		}
	}

	this.allocDrawTarget = function(width, height, view, drawtarget, passid){
		width = floor(width)
		height = floor(height)
		var Texture = this.device.Texture
		if(!this.drawtargets) this.drawtargets = []
		if(this.drawtargets.indexOf(drawtarget) === -1) this.drawtargets.push(drawtarget)
		var dt = this[drawtarget]
		//var twidth = this.nextPowerTwo(layout.width* main_ratio), theight = this.nextPowerTwo(layout.height* main_ratio)
		if(!dt){
			// lets scan the pools for a suitable drawtarget, otherwise create it
			var pool = this.device.drawtarget_pools[drawtarget]
			if(pool && pool.length){
				// first find a drawtarget with the same size
				for(var i = 0; i < pool.length; i ++){
					var tgt = pool[i]
					if(!tgt) continue
					var size = tgt.size
					if(size[0] === width && size[1] === height){
						// lets remove it from the pool
						pool.splice(i,1)
						dt = tgt
						break
					}
				}
				// then we find a drawtarget with the same passid as last time
				if(!dt){
					for(var i = 0; i < pool.length; i++){
						var tgt = pool[i]
						if(!tgt) continue
						if(passid === tgt.passid){
							dt = tgt
							pool.splice(i,1)
							break
						}
					}
				}
			}
			// otherwise we create a new one
			if(!dt){
				dt = this[drawtarget] = Texture.createRenderTarget(view._viewport === '2d'?Texture.RGB:Texture.RGBA|Texture.DEPTH|Texture.STENCIL, width, height, this.device)
			}
			else this[drawtarget] = dt
			dt.passid = passid
		}
		// make sure the drawtarget has the right size
		var tsize = this[drawtarget].size
		if(width !== tsize[0] || height !== tsize[1]){
			this[drawtarget].delete()
			this[drawtarget] = Texture.createRenderTarget(view._viewport === '2d'?Texture.RGB:Texture.RGBA|Texture.DEPTH|Texture.STENCIL, width, height, this.device)
		}
	}

	this.calculateDrawMatrices = function(isroot, storage, pointerx, pointery){
		var view = this.view
		var scroll = view._scroll
		var layout = view._layout

		if(view._viewport === '2d'){
			if(isroot && pointerx !== undefined){
				var sizel = 0
				var sizer = 1
				mat4.ortho(scroll[0] + pointerx - sizel, scroll[0] + pointerx + sizer, scroll[1] + pointery - sizer,  scroll[1] + pointery + sizel, -100, 100, storage.viewmatrix)
				mat4.ortho(pointerx - sizel, pointerx + sizer, pointery - sizer, pointery + sizel, -100, 100, storage.noscrollmatrix)
			}
			else{
				var zoom = view._zoom
				if (isroot){
					mat4.ortho(scroll[0], layout.width*zoom+scroll[0], scroll[1], layout.height*zoom+scroll[1], -100, 100, storage.viewmatrix)
					mat4.ortho(0, layout.width, 0, layout.height, -100, 100, storage.noscrollmatrix)
				}
				else{
					mat4.ortho(scroll[0], layout.width*zoom+scroll[0], layout.height*zoom+scroll[1], scroll[1], -100, 100, storage.viewmatrix)
					mat4.ortho(0, layout.width, layout.height, 0, -100, 100, storage.noscrollmatrix)
				}
			}
		}
		else if(view._viewport === '3d'){
			storage.perspectivematrix = mat4.perspective(view._fov * PI * 2/360.0 , layout.width/layout.height, view._nearplane, view._farplane)
			storage.lookatmatrix = mat4.lookAt(view._camera, view._lookat, view._up)
			storage.viewmatrix = mat4.mat4_mul_mat4(storage.lookatmatrix,storage.perspectivematrix);
		}
	}

	function isInBounds2D(view, draw){
		if(draw.noboundscheck) return true
		var height = view._layout.height
		var width = view._layout.width
		var drawlayout = draw._layout

		if(draw.parent && draw.parent !== view){
			drawlayout.absx = draw.parent._layout.absx + drawlayout.left
			drawlayout.absy = draw.parent._layout.absy + drawlayout.top
		}
		else{
			drawlayout.absx = drawlayout.left
			drawlayout.absy = drawlayout.top
		}

		if(draw === view && view.sublayout){
			width = view.sublayout.width
			height = view.sublayout.height
		}
		// early out check
		if(draw !== view && !draw.noscroll){
			var scroll = view._scroll
			var zoom = view._zoom
			if( drawlayout.absy - scroll[1] > height * zoom || drawlayout.absy + drawlayout.height - scroll[1] < 0){
				return false
			}
			if(drawlayout.absx - scroll[0] > width * zoom || drawlayout.absx + drawlayout.width - scroll[0] < 0){
				return false
			}
		}
		return true
	}

	this.nextItem = function(draw, nottype){
		var view = this.view
		var next = (draw === view || (!draw._viewport && draw._visible && draw._drawtarget !== nottype))  && draw.children[0], next_index = 0
		while(!next){ // skip to parent next
			if(draw === view) break
			next_index = draw.draw_index + 1
			draw = draw.parent
			next = draw.children[next_index]
		}
		if(next === view) return undefined
		if(next) next.draw_index = next_index
		return next
	}

	this.drawPick = function(isroot, passid, pointerx, pointery, debug){
		var view = this.view
		var device = this.device
		var layout = view._layout
		var gl = device.gl
		if(!layout || layout.width === 0 || isNaN(layout.width) || layout.height === 0 || isNaN(layout.height)) return

		if(isroot){
			if(!debug) this.allocDrawTarget(1, 1, this.view, 'pick_buffer', passid)
		}
		else{
			var ratio = view._pixelratio
			if(isNaN(ratio)) ratio = device.main_frame.ratio
			ratio = 1
			var twidth = layout.width * ratio, theight = layout.height * ratio
			this.allocDrawTarget(twidth, theight, this.view, 'pick_buffer', passid)
		}
		gl.disable(gl.SCISSOR_TEST)
		device.bindFramebuffer(this.pick_buffer || null)
		device.clear(0,0,0,0)

		var matrices = this.pickmatrices
		this.calculateDrawMatrices(isroot, matrices, debug?undefined:pointerx, pointery)
		// calculate the colormatrices too
		//if(!this.colormatrices.initialized){
		//	this.calculateDrawMatrices(isroot, this.colormatrices)
		//}

		var pickguid = vec3()
		pickguid[0] = passid/255//(((passid)*131)%256)/255

		// modulo inverse: http://www.wolframalpha.com/input/?i=multiplicative+inverse+of+31+mod+256
		var pick_id = 0
		var draw = view
		while(draw){
			draw.draw_dirty &= 1

			pick_id+= draw.pickrange;
			if(!draw._visible || draw._drawtarget==='color' || draw._first_draw_pick && view._viewport === '2d' && draw.boundscheck && !isInBounds2D(view, draw)){ // do early out check using bounding boxes
			}
			else{
				draw._first_draw_pick = 1

				var id = pick_id//(pick_id*29401)%65536
				pickguid[1] = (id&255)/255
				pickguid[2] = (id>>8)/255

				draw.pickguid = pickguid[0]*255<<16 | pickguid[1]*255 << 8 | pickguid[2]*255
				draw.viewmatrix = matrices.viewmatrix

				if(!draw._visible) continue
				if(draw._viewport && draw.drawpass !== this && draw.drawpass.pick_buffer){
					// ok so the pick pass needs the alpha from the color buffer
					// and then hard forward the color
					var blendshader = draw.shaders.viewportblend
					if (view._viewport === '3d'){
						// dont do this!
						if (shader.depth_test == '') shader.depth_test = 'src_depth <= dst_depth'												
					}
					else{
						blendshader.depth_test = ''
					}
					blendshader.texture = draw.drawpass.pick_buffer
					blendshader._width = draw.layout.width
					blendshader._height = draw.layout.height
					blendshader.drawArrays(this.device)
				}
				else{
					//draw.updateShaders()
					// alright lets iterate the shaders and call em
					var shaders =  draw.shader_draw_list
					for(var j = 0; j < shaders.length; j++){
						var shader = shaders[j]

						if(view._viewport === '3d'){
							if (shader.depth_test == '') shader.depth_test = 'src_depth <= dst_depth'
						}

						shader.pickguid = pickguid
						if(!shader.visible) continue
						if(draw.pickalpha !== undefined)shader.pickalpha = draw.pickalpha
						if(shader.noscroll) draw.viewmatrix = matrices.noscrollmatrix
						else draw.viewmatrix = matrices.viewmatrix

						shader.drawArrays(this.device, 'pick')
					}
				}
			}
			draw = this.nextItem(draw, 'color')
		}
	}

	this.getDrawID = function(id){
		var view = this.view
		var draw = view
		var pick_id = 0
		while(draw){

			if(id > pick_id && id <= pick_id + draw.pickrange){
				draw.last_pick_id = (pick_id + draw.pickrange) - id
				return draw
			}

			pick_id += draw.pickrange

			draw = this.nextItem(draw)
		}
	}

	this.drawBlend = function(draw){
		if(!draw.drawpass.color_buffer){
			console.error("Null color_buffer detected, did you forget sizing/flex:1 on your 3D viewport?")
		}
		else {
			// ok so when we are drawing a pick pass, we just need to 1 on 1 forward the color data
			// lets render the view as a layer
			var blendshader = draw.shaders.viewportblend
			if (this.view._viewport === '3d'){
				blendshader.depth_test = 'src_depth <= dst_depth'
			}
			else{
				blendshader.depth_test = ''
			}
			blendshader.texture = draw.drawpass.color_buffer
			blendshader.width = draw._layout.width
			blendshader.height = draw._layout.height
			blendshader.drawArrays(this.device)
		}
	}

	this.drawNormal = function(draw, view, matrices){
		draw.updateShaders()
		var count = 0
		// alright lets iterate the shaders and call em
		var shaders = draw.shader_draw_list
		for(var j = 0; j < shaders.length; j++){
			// lets draw em
			var shader = shaders[j]
			if(view._viewport === '3d'){
				shader.depth_test = 'src_depth < dst_depth'
			}

			if(shader.pickonly || !shader.visible) continue // was pick only
			// we have to set our guid.
			if(shader.noscroll) draw.viewmatrix = matrices.noscrollmatrix
			else draw.viewmatrix = matrices.viewmatrix
			count++
			shader.drawArrays(this.device)
		}
		return count
	}

	this.drawColor = function(isroot, time, clipview){
		var view = this.view
		var device = this.device
		var layout = view._layout
		var gl = device.gl
		var count = 0
		if(!layout || layout.width === 0 || isNaN(layout.width) || layout.height === 0 || isNaN(layout.height)) return

		// lets see if we need to allocate our framebuffer..
		if(!isroot){
			var ratio = view._pixelratio
			if(isNaN(ratio)) ratio = device.main_frame.ratio
			var twidth = layout.width * ratio, theight = layout.height * ratio
			this.allocDrawTarget(twidth, theight, this.view, 'color_buffer')
		}

		this.device.bindFramebuffer(this.color_buffer || null)

		if(layout.width === 0 || layout.height === 0) return false

		var hastime = false
		var zoom = view._zoom

		var matrices = this.colormatrices
		this.calculateDrawMatrices(isroot, matrices);
		view.colormatrices = matrices
		
		gl.disable(gl.SCISSOR_TEST)
		
		if(isroot){
			/*
			if(clipview){
				var ratio = this.device.frame.ratio
				var xs = this.device.frame.size[0] / ratio
				var ys = this.device.frame.size[1] / ratio
				var clayout = clipview._layout
				var c1 = vec2.mul_mat4(vec2(0, 0),clipview.viewportmatrix)
				var c2 = vec2.mul_mat4(vec2(clayout.width, clayout.height),clipview.viewportmatrix)
				var x1 = c1[0], y1 = c1[1], x2 = c2[0] - x1, y2 = c2[1] - y1
				gl.enable(gl.SCISSOR_TEST)
				gl.scissor((x1)*ratio, (ys - y2 - y1)*ratio, x2 * ratio, (y2)*ratio)//x1*2, y1*2, x2*2, y2*2)
			}
			*/
		}

		device.clear(view._clearcolor)

		var draw = view
		while(draw){
			draw.draw_dirty &= 2

			//}
			//for(var dl = this.draw_list, i = 0; i < dl.length; i++){
			//	var draw = dl[i]
			if(!draw._visible || draw._drawtarget==='pick' || draw._first_draw_color && view._viewport === '2d' && draw.boundscheck && !isInBounds2D(view, draw)){ // do early out check using bounding boxes
			}
			else{
				draw._first_draw_color = 1

				//if(view.constructor.name === 'slideviewer')console.log('here',draw.constructor.name, draw.text)
				draw._time = time
				if(draw._listen_time || draw.ontime) hastime = true

				draw.viewmatrix = matrices.viewmatrix

				if(draw.atDraw) draw.atDraw(this)
				if(draw._viewport && draw.drawpass !== this){
					this.drawBlend(draw)
				}
				else{
					count += this.drawNormal(draw, view, matrices)
				}


				if(draw.debug_view){
					this.debugrect.view = draw
					this.debugrect.drawArrays(this.device)
				}
			}
			draw = this.nextItem(draw, 'pick')
		}
		//console.log(count)
		return hastime
	}

	var DebugRect = define.class(Shader, function(){
		this.view = {totalmatrix:mat4(), viewmatrix:mat4(), layout:{width:0, height:0}}

		this.mesh = vec2.array()
		this.mesh.pushQuad(0,0,1,0,0,1,1,1)

		this.position = function(){
			return vec4(vec2(mesh.x * view.layout.width, mesh.y * view.layout.height), 0, 1) * view.totalmatrix * view.viewmatrix
		}
		this.color = function(){
			return vec4(1,0,0,0.5)
		}
	})

})
