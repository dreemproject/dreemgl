/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, baseclass){
	// drawing

	this.atConstructor = function(gldevice, view){
		this.device = gldevice
		this.view = view
		view.drawpass = this
		// lets do the flatten
		this.draw_list = []

		this.addToDrawList(this.view, true)

		this.pickmatrices = {
			viewmatrix: mat4.identity(),
			noscrollmatrix: mat4.identity()
		}

		this.colormatrices = {
			viewmatrix: mat4.identity(),
			noscrollmatrix: mat4.identity()
		}
	}

	
	this.atDestroy = function(){
		this.releaseTexture()
	}
		
	this.addToDrawList = function(view, isroot){
		//matrix = matrix? matrix: mat4.identity()
		//view.draw_matrix = mat4.mul_mat4(view.layout_matrix, matrix)
		this.draw_list.push(view)

		if(this.draw_list.length > 65535) throw new Error("Too many items in a drawpass, ID space out of range, you get a piece of pie.")
		if(isroot || !view._viewport){
			var children = view.children
			if(children) for(var i = 0; i < children.length; i++){
				this.addToDrawList(children[i])
			}
		}
	}

	this.poolDrawTargets = function(){
		var pools = this.device.drawtarget_pools
		if(!this.drawtargets) return
		for(var i = 0; i < this.drawtargets.length; i ++){
			var dt = this.drawtargets[i]
			if(!pools[dt]) pools[dt] = []
			pools[dt].push(this[dt])
			this[dt] = undefined
		}
	}

	this.allocDrawTarget = function(width, height, mode, drawtarget, passid){
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
				dt = this[drawtarget] = Texture.createRenderTarget(mode === '2D'?Texture.RGBA:Texture.RGBA|Texture.DEPTH|Texture.STENCIL, width, height, this.device)
			}
			else this[drawtarget] = dt
			dt.passid = passid
		} 
		// make sure the drawtarget has the right size
		var tsize = this[drawtarget].size
		if(width !== tsize[0] || height !== tsize[1]){
			this[drawtarget].delete()
			this[drawtarget] = Texture.createRenderTarget(mode === '2D'?Texture.RGBA:Texture.RGBA|Texture.DEPTH|Texture.STENCIL, width, height, this.device)
		}
	}
	
	this.calculateDrawMatrices = function(isroot, storage, mousex, mousey){
		var view = this.view
		var scroll = view._scroll
		var layout = view.layout

		if(view._viewport === '2D'){
			if(isroot && mousex !== undefined){
				var sizel = 0
				var sizer = 1
				mat4.ortho(scroll[0] + mousex - sizel, scroll[0] + mousex + sizer, scroll[1] + mousey - sizer,  scroll[1] + mousey + sizel, -100, 100, storage.viewmatrix)
				mat4.ortho( mousex - sizel, mousex + sizer, mousey - sizer, mousey + sizel, -100, 100, storage.noscrollmatrix)
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
		else if(view._viewport === '3D'){
			storage.perspectivematrix = mat4.perspective(view._fov * PI * 2/360.0 , layout.width/layout.height, view._nearplane, view._farplane)			
			storage.lookatmatrix = mat4.lookAt(view._camera, view._lookat, view._up)
			storage.viewmatrix = mat4.mat4_mul_mat4(storage.lookatmatrix,storage.perspectivematrix);
		}
	}

	function isInBounds2D(view, draw){

		var height = view._layout.height
		var width = view._layout.width
		var drawlayout = draw.layout

		if(draw.parent && draw.parent !== view){
			drawlayout.absx = draw.parent.layout.absx + drawlayout.left
			drawlayout.absy = draw.parent.layout.absy + drawlayout.top
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

	this.drawPick = function(isroot, passid, mousex, mousey, debug){
		var view = this.view
		var device = this.device
		var layout = view.layout

		if(!layout || layout.width === 0 || isNaN(layout.width) || layout.height === 0 || isNaN(layout.height)) return

		if(isroot){
			if(!debug) this.allocDrawTarget(1, 1, this.view._viewport, 'pick_buffer', passid)
		}
		else{
			var ratio = view._pixelratio
			if(isNaN(ratio)) ratio = device.main_frame.ratio
			var twidth = layout.width * ratio, theight = layout.height * ratio
			this.allocDrawTarget(twidth, theight, this.view._viewport, 'pick_buffer', passid)
		}

		device.bindFramebuffer(this.pick_buffer || null)
		device.clear(0,0,0,0)
		
		var matrices = this.pickmatrices
		this.calculateDrawMatrices(isroot, matrices, debug?undefined:mousex, mousey)

		var pickguid = vec3()
		pickguid[0] = (((passid+1)*131)%256)/255

		// modulo inverse: http://www.wolframalpha.com/input/?i=multiplicative+inverse+of+31+mod+256
		for(var dl = this.draw_list, i = 0; i < dl.length; i++){
			var draw = dl[i]

			if(draw._first_draw_pick && view._viewport === '2D' && view.boundscheck && !isInBounds2D(view, draw)){ // do early out check using bounding boxes
				continue
			}
			else draw._first_draw_pick = 1

			var id = ((i+1)*29401)%65536
			pickguid[1] = (id&255)/255
			pickguid[2] = (id>>8)/255

			draw.pickguid = pickguid[0]*255<<16 | pickguid[1]*255 << 8 | pickguid[2]*255
			draw.viewmatrix = matrices.viewmatrix

			if(!draw._visible) continue
			if(draw._viewport && draw.drawpass !== this && draw.drawpass.pick_buffer){
				// ok so the pick pass needs the alpha from the color buffer
				// and then hard forward the color
				var blendshader = draw.blendshader
				if (view._viewport === '3D'){
					// dont do this!
					blendshader.depth_test = 'src_depth <= dst_depth'
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
				var shaders =  draw.shader_list
				for(var j = 0; j < shaders.length; j++){
					var shader = shaders[j]

					shader.pickguid = pickguid

					if(shader.order < 0) draw.viewmatrix = matrices.noscrollmatrix
					else draw.viewmatrix = matrices.viewmatrix

					shader.drawArrays(this.device, 'pick')
				}
			}
		}
	}

	
	this.drawColor = function(isroot, time){
		var view = this.view
		var device = this.device
		var layout = view.layout

		if(!layout || layout.width === 0 || isNaN(layout.width) || layout.height === 0 || isNaN(layout.height)) return
	
		// lets see if we need to allocate our framebuffer..
		if(!isroot){
			var ratio = view._pixelratio
			if(isNaN(ratio)) ratio = device.main_frame.ratio
			var twidth = layout.width * ratio, theight = layout.height * ratio	
			this.allocDrawTarget(twidth, theight, this.view._viewport, 'color_buffer')
		}

		this.device.bindFramebuffer(this.color_buffer || null)

		if(layout.width === 0 || layout.height === 0) return
	
		device.clear(view._clearcolor)
		
		var hastime = false
		var zoom = view._zoom

		var matrices = this.colormatrices
		this.calculateDrawMatrices(isroot, matrices);

		// each view has a reference to its layer
		for(var dl = this.draw_list, i = 0; i < dl.length; i++){
			var draw = dl[i]

			if(draw._first_draw_color && view._viewport === '2D' && view.boundscheck && !isInBounds2D(view, draw)){ // do early out check using bounding boxes
				continue
			}
			else draw._first_draw_color = 1

			//if(view.constructor.name === 'slideviewer')console.log('here',draw.constructor.name, draw.text)
			draw._time = time
			if(draw._listen_time || draw.ontime) hastime = true
				
			draw.viewmatrix = matrices.viewmatrix

			if(!draw._visible) continue

			if(draw.atDraw) draw.atDraw(this)

			if(draw._viewport && draw.drawpass !== this && draw.drawpass.color_buffer){
				// ok so when we are drawing a pick pass, we just need to 1 on 1 forward the color data
				// lets render the view as a layer
				var blendshader = draw.blendshader
				if (view._viewport === '3D'){
					blendshader.depth_test = 'src_depth <= dst_depth'
				}
				else{
					blendshader.depth_test = ''
				}
				blendshader.texture = draw.drawpass.color_buffer
				blendshader.width = draw.layout.width
				blendshader.height = draw.layout.height
				blendshader.drawArrays(this.device)
			}
			else{
				draw.updateShaders()
				// alright lets iterate the shaders and call em
				var shaders =  draw.shader_list
				for(var j = 0; j < shaders.length; j++){
					// lets draw em
					var shader = shaders[j]
					if(isNaN(shader.order)) continue // was pick only
					// we have to set our guid.
					if(shader.order < 0) draw.viewmatrix = matrices.noscrollmatrix
					else draw.viewmatrix = matrices.viewmatrix

					shader.drawArrays(this.device)
				}
			}
		}

		return hastime
	}

	/*
	var MyShader = define.class(this.Shader, function(){
		this.mesh = vec2.array()
		this.mesh.pushQuad(-1,-1,1,-1,-1,1,1,1)
		this.position = function(){
			return vec4(mesh.xy,0,1) 
		}
		this.color = function(){
			if(mesh.x<-0.9)return 'red'
			if(mesh.x>0.9)return 'red'
			return 'black'
		}
	})*/
})