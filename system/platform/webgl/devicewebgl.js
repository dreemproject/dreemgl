/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, exports){

	this.Keyboard = require('./keyboardwebgl')
	this.Mouse = require('./mousewebgl')
	this.Touch = require('./touchwebgl')

	// require embedded classes	
	this.Shader = require('./shaderwebgl')
	this.Texture = require('./texturewebgl')
	this.Texture.Image = typeof Image !== 'undefined' && Image
	this.DrawPass = require('./drawpasswebgl')

	this.preserveDrawingBuffer = true
	this.premultipliedAlpha = false
	this.antialias = false
	this.debug_pick = false

	this.document = typeof window !== 'undefined'?window : null

	this.atConstructor = function(previous){

		this.extensions = previous && previous.extensions || {}
		this.shadercache = previous &&  previous.shadercache || {}
		this.drawpass_list = previous && previous.drawpass_list || []
		this.layout_list = previous && previous.layout_list || []
		this.pick_resolve = []	
		this.anim_redraws = []
		this.doPick = this.doPick.bind(this)

		this.animFrame = function(time){
			if(this.doColor(time)){
				this.document.requestAnimationFrame(this.animFrame)
			}
			else this.anim_req = false
			//if(this.pick_resolve.length) this.doPick()
		}.bind(this)
	
		if(previous){
			this.canvas = previous.canvas
			this.gl = previous.gl
			this.mouse = previous.mouse
			this.keyboard = previous.keyboard
			this.touch = previous.touch
			this.parent = previous.parent
			this.drawtarget_pools = previous.drawtarget_pools
			this.frame = this.main_frame = previous.main_frame
		}
		else{
			this.frame = 
			this.main_frame = this.Texture.fromType('rgb_depth_stencil')

			this.mouse = new this.Mouse(this)
			this.keyboard = new this.Keyboard(this)
			this.touch = new this.Touch(this)
			this.drawtarget_pools = {}

			this.createContext()
		}

		this.initResize()
	}

	this.createContext = function(){
		if(!this.parent) this.parent = document.body

		this.canvas = document.createElement("canvas")
		this.canvas.className = 'unselectable'
		this.parent.appendChild(this.canvas)
		
		var options = {
			alpha: this.frame.type.indexOf('rgba') != -1,
			depth: this.frame.type.indexOf('depth') != -1,
			stencil: this.frame.type.indexOf('stencil') != -1,
			antialias: this.antialias,
			premultipliedAlpha: this.premultipliedAlpha,
			preserveDrawingBuffer: this.preserveDrawingBuffer,
			preferLowPowerToHighPerformance: this.preferLowPowerToHighPerformance
		}

		this.gl = this.canvas.getContext('webgl', options) || 
			this.canvas.getContext('webgl-experimental', options) || 
			this.canvas.getContext('experimental-webgl', options)

		if(!this.gl){
			console.log(this.canvas)
			console.log("Could not get webGL context!")
		}

		// require derivatives
		this.getExtension('OES_standard_derivatives')		
	}

	this.initResize = function(){
		//canvas.webkitRequestFullscreen()
		var resize = function(){
			var pixelRatio = window.devicePixelRatio

			var w = this.parent.offsetWidth
			var h = this.parent.offsetHeight

			var sw = w * pixelRatio
			var sh = h * pixelRatio

			this.canvas.width = sw
			this.canvas.height = sh
			this.canvas.style.width = w + 'px'
			this.canvas.style.height = h + 'px'

			this.gl.viewport(0, 0, sw, sh)
			// store our w/h and pixelratio on our frame

			this.main_frame.ratio = pixelRatio
			this.main_frame.size = vec2(sw, sh) // actual size
			this.size = vec2(w, h)
			this.ratio = this.main_frame.ratio
		}.bind(this)

		window.onresize = function(){
			resize()
			this.atResize()
			this.redraw()
		}.bind(this)

		resize()		
	}

	this.clear = function(r, g, b, a){
		if(arguments.length === 1){
			a = r.length === 4? r[3]: 1, b = r[2], g = r[1], r = r[0]
		}
		if(arguments.length === 3) a = 1
		this.gl.clearColor(r, g, b, a)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT|this.gl.STENCIL_BUFFER_BIT)
	}

	this.getExtension = function(name){
		var ext = this.extensions[name]
		if(ext) return ext
		return this.extensions[name] = this.gl.getExtension(name)
	}

	this.redraw = function(){
		if(this.anim_req) return
		this.anim_req = true
		this.document.requestAnimationFrame(this.animFrame)
	}

	this.bindFramebuffer = function(frame){
		if(!frame) frame = this.main_frame
	
		this.frame = frame
		this.size = vec2(frame.size[0]/frame.ratio, frame.size[1]/frame.ratio)

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frame.glframe_buf || null)
		this.gl.viewport(0, 0, frame.size[0], frame.size[1])
	}

	this.readPixels = function(x, y, w, h){
		var buf = new Uint8Array(w * h * 4)
		this.gl.readPixels(x , y , w , h, this.gl.RGBA, this.gl.UNSIGNED_BYTE, buf)
		return buf
	}

	this.doPick = function(){
		this.pick_timer = 0
		var x = this.pick_x, y = this.pick_y
		for(var i = 0, len = this.drawpass_list.length; i < len; i++){
			var last = i === len - 1 
			var skip = false
			var view = this.drawpass_list[i]

			// little hack to dont use rtt if you only use a single view
			if(view.parent == this.screen && view.flex ==1 && this.screen.children.length ===1){
				skip = last = true
			}
			// lets set up glscissor on last
			// and then read the goddamn pixel
			if(last || view.draw_dirty & 2){
				view.draw_dirty &= 1
				view.drawpass.drawPick(last, i, x, y, this.debug_pick)
			}
			if(skip){
				this.screen.draw_dirty &= 1
				break
			}
		}
		// now lets read the pixel under the mouse
		var pick_resolve = this.pick_resolve
		this.pick_resolve = []

		if(this.debug_pick){
			var data = this.readPixels(x*this.ratio,this.main_frame.size[1] - y*this.ratio,1,1)
		}
		else{
			var data = this.readPixels(0,0,1,1)
		}
		
		// decode the pass and drawid
		var passid = (data[0]*43)%256 - 1
		var drawid = (((data[2]<<8) | data[1])*60777)%65536 - 1
		// lets find the view.
		var passview = this.drawpass_list[passid]
		var drawpass = passview && passview.drawpass
		var view = drawpass && drawpass.draw_list[drawid]

		while(view && view.nopick){
			view = view.parent
		}

		for(var i = 0; i < pick_resolve.length; i++){
			pick_resolve[i](view)
		}
	}

	this.pickScreen = function(x, y){
		// promise based pickray rendering
		return new Promise(function(resolve, reject){
			this.pick_resolve.push(resolve)
			this.pick_x = x
			this.pick_y = y
			if(!this.pick_timer){
				this.pick_timer = setTimeout(this.doPick, 0)
			}
			//this.doPick()
		}.bind(this))
	}

	this.doColor = function(time){
		if(!this.first_time) this.first_time = time

		var stime = (time - this.first_time) / 1000
		// lets layout shit that needs layouting.
		var anim_redraw = this.anim_redraws
		anim_redraw.length = 0
		this.screen.doAnimation(stime, anim_redraw)

		// set the size externally of the main view
		//var screen = this.layout_list[this.layout_list.length - 1]
		this.screen._maxsize =
		this.screen._size = vec2(this.main_frame.size[0] / this.ratio, this.main_frame.size[1] / this.ratio)
		// do the dirty layouts
		for(var i = 0; i < this.layout_list.length; i++){
			// lets do a layout?
			var view = this.layout_list[i]
			if(view.layout_dirty){
				view.doLayout()
				view.layout_dirty = false
			}
		}

		// lets draw draw all dirty passes.
		var hastime
		for(var i = 0, len = this.drawpass_list.length; i < len; i++){
			var view = this.drawpass_list[i]

			var skip = false
			var last = i === len - 1

			if(view.parent == this.screen && view.flex ==1 && this.screen.children.length ===1){
				skip = last = true							
			}

			if(view.draw_dirty & 1 || last){
				var viewhastime = view.drawpass.drawColor(last, stime)
				if(!viewhastime){
					view.draw_dirty &= 2
				}
				else hastime = viewhastime
			}

			if(skip){
				this.screen.drawpass.calculateDrawMatrices(false, this.screen.drawpass.colormatrices);
				
				
				this.screen.draw_dirty &= 2
				break
			}
		}

		if(anim_redraw.length){
			for(var i = 0; i < anim_redraw.length; i++){
				anim_redraw[i].redraw()
			}
			return true
		}
		return hastime
	}

	this.atNewlyRendered = function(view){
		// if view is not a layer we have to find the layer, and regenerate that whole layer.
		if(!view.parent) this.screen = view // its the screen
		// alright lets do this.
		var node = view
		while(!node._viewport){
			node = node.parent
		}
		
		if(!node.parent){ // fast path to chuck the whole set
			// lets put all the drawpasses in a pool for reuse
			for(var i = 0; i < this.drawpass_list.length; i++) this.drawpass_list[i].drawpass.poolDrawTargets()
			this.drawpass_list = []
			this.layout_list = []
			this.drawpass_idx = 0
			this.layout_idx_first = 0
			this.layout_idx = 0
			this.addDrawPassRecursive(node)
		}
		else{ // else we remove drawpasses first then re-add them
			this.removeDrawPasses(node)
			this.layout_idx_first = this.layout_idx
			this.addDrawPassRecursive(node)
		}
		node.relayout()
	}

	// remove drawpasses related to a view
	this.removeDrawPasses = function(view){
		// we have to remove all the nodes which have view as their parent layer
		var drawpass_list = this.drawpass_list
		this.drawpass_idx = Infinity
		for(var i = 0; i < drawpass_list.length; i++){
			var node = drawpass_list[i]
			while(node.parent && node !== view){
				node = node.parent
			}
			if(node === view){
				if(i < this.drawpass_idx) this.drawpass_idx = i
				node.drawpass.poolDrawTargets()
				drawpass_list.splice(i, 1)
				break
			}
		}
		if(this.drawpass_idx === Infinity) this.drawpass_idx = 0
		// now remove all layouts too
		this.layout_idx = Infinity
		var layout_list = this.layout_list
		for(var i = 0; i < layout_list.length; i++){
			var pass = layout_list[i]
			var node = pass
			while(node.parent && node !== view){
				node = node.parent
			}
			if(node === view){
				if(i < this.layout_idx) this.layout_idx = i
				layout_list.splice(i, 1)
			}
		}
		if(this.layout_idx === Infinity) this.layout_idx = 0
	}

	// add drawpasses and layouts recursively from a view
	this.addDrawPassRecursive = function(view){
		// lets first walk our children( depth first)
		var children = view.children
		if(children) for(var i = 0; i < children.length; i++){
			this.addDrawPassRecursive(children[i])
		}

		// lets create a drawpass 
		if(view._viewport){
			var pass = new this.DrawPass(this, view)
			this.drawpass_list.splice(this.drawpass_idx,0,view)
			this.drawpass_idx++
			// lets also add a layout pass
			if(isNaN(view._flex)){ // if not flex, make sure layout runs before the rest
				// we are self contained
				this.layout_list.splice(this.layout_idx_first,0,view)
			}
			else{ // we are flex, make sure we layout after
				this.layout_list.splice(this.layout_idx,0,view)
			}
			//this.layout_idx++
		}

	}

	this.relayout = function(){
		var layout_list = this.layout_list
		for(var i = 0; i < layout_list.length; i++){
			view = layout_list[i]
			if(!isNaN(view._flex) || view == this.screen){
				view.relayout()
			}
		}
	}

	this.atResize = function(){
		// lets relayout the whole fucker
		this.relayout()
		this.redraw()
		// do stuff
	}
	


})