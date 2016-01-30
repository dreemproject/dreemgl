/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others. 
	 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
	 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(require, exports){

	//Stub out gl calls
	gl = {
	getUniformLocation: function() {}
	,getAttribLocation: function() {}
	,uniform4f: function() {}
	,drawArrays: function() {}
	,framebufferTexture2D: function() {}
	,bindRenderbuffer: function() {}
	,createRenderbuffer: function() { return {};}
	,createFramebuffer: function() { return {};}
	,bindFramebuffer: function() {}
	,renderbufferStorage: function() {}
	,framebufferRenderbuffer: function() {}
	,viewport: function() {}
	,clearColor: function() {}
	,clear: function() {}
	,createShader: function() {}
	,attachShader: function() {}
	,shaderSource: function() {}
	,compileShader: function() {}
	,createTexture: function() { return {};}
	,activeTexture: function() {}
	,bindTexture: function() {}
	,getShaderParameter: function() {}
	,getShaderInfoLog: function() {return ''}
	,useProgram: function() {}
	,createBuffer: function() {return 0;}
	,bindBuffer: function() {}
	,bufferData: function() {}
	,enable: function() {}
	,disable: function() {}
	,blendEquation: function() {}
	,blendFunc: function() {}
	,enableVertexAttribArray: function() {}
	,vertexAttribPointer: function() {}
	,uniform1f: function(l,v) {console.log('uniform1f', l,v);return 0;}
	,uniform2f: function() {return 0;}
	,uniform3f: function() {return 0;}
	,uniform4f: function() {return 0;}
	,uniform1i: function() {return 0;}
	,uniformMatrix4fv: function() {return 0;}
	,pixelStorei: function() {}
	,texParameterf: function() {}
	,texParameteri: function() {}
	,depthFunc: function() {}
	,texImage2D: function() {}
	};

	// HeadlessApi is a static object to access the headless api
	this.HeadlessApi = require('./headless_api')

	this.Keyboard = require('./keyboardheadless')
	this.Pointer = require('./pointerheadless')

	// require embedded classes
	this.Shader = require('./shaderheadless')
	this.Texture = require('./textureheadless')
	this.DrawPass = require('./drawpassheadless')

	this.preserveDrawingBuffer = false
	this.premultipliedAlpha = false
	this.antialias = false
	this.debug_pick = false

	this.document = null

	this.atConstructor = function(previous){

		this.extensions = previous && previous.extensions || {}
		this.shadercache = previous &&	previous.shadercache || {}
		this.drawpass_list = previous && previous.drawpass_list || []
		this.layout_list = previous && previous.layout_list || []
		this.pick_resolve = []
		this.anim_redraws = []
		this.doPick = this.doPick.bind(this)

		//TODO Use setTimeout for animation until headless animation ready (HEADLESS)
		this.time = 0;
		this.animFrame = function(time){
			//console.log('animFrame', time);
			var interval = 16; // 500;
			var t = this.doColor(time);
			if(t){
				this.anim_req = true
				this.time += interval;
				if (this.time > HeadlessApi.duration) {
					// Stop running
					HeadlessApi.terminate();
				}
				
				setTimeout(function() {this.animFrame(this.time);}.bind(this), interval)
			}
			else {
				this.anim_req = false

				// Stop running
				HeadlessApi.terminate();
			}
			//if(this.pick_resolve.length) this.doPick()
		}.bind(this)


		if(previous){
			this.canvas = previous.canvas
			this.gl = previous.gl
			this.keyboard = previous.keyboard
			this.pointer = previous.pointer
			this.parent = previous.parent
			this.drawtarget_pools = previous.drawtarget_pools
			this.frame = this.main_frame = previous.main_frame
		}
		else{
			this.frame =
			this.main_frame = this.Texture.fromType('rgb_depth')
			this.keyboard = new this.Keyboard(this)
			this.pointer = new this.Pointer(this)
			this.drawtarget_pools = {}

			this.createContext()
		}

		this.initResize()
	}

	this.createContext = function(){
		console.log('deviceheadless.createContext NOT implemented')
	}

	this.initResize = function(){
		// Get size of stage
		this.width = HeadlessApi.size.x;
		this.height = HeadlessApi.size.y;
		this.ratio = HeadlessApi.dpi.x / HeadlessApi.dpi.y;

		//console.log('initResize size ', size, dpi);

		//Stub gl calls (to avoid javascript errors)
		this.gl = gl;

		this.main_frame = {ratio: this.ratio, size: vec2(this.width, this.height)}
		this.size = vec2(this.width, this.height);
	}

	this.clear = function(r, g, b, a){
		if(arguments.length === 1){
			a = r.length === 4? r[3]: 1, b = r[2], g = r[1], r = r[0]
		}
		if(arguments.length === 3) a = 1

		HeadlessApi.setBackgroundColor([r,g,b,a]);

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

		this.time = 0
		setTimeout(function() {this.animFrame(this.time);}.bind(this), 0)
	}

	this.bindFramebuffer = function(frame){
		if(!frame) frame = this.main_frame

		this.frame = frame
		this.size = vec2(frame.size[0]/frame.ratio, frame.size[1]/frame.ratio)

		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frame.glframe_buf || null)
		this.gl.viewport(0, 0, frame.size[0], frame.size[1])

		// Set the layer to use (root layer if frame.headless_layer doesn't exist)
		//TODO When layers are used, use framebuffers to render them.
		//this.HeadlessApi.setLayer(frame.headless_layer);
	}

	this.readPixels = function(x, y, w, h){
		var buf = new Uint8Array(w * h * 4)
		this.gl.readPixels(x , y , w , h, this.gl.RGBA, this.gl.UNSIGNED_BYTE, buf)
		return buf
	}

	this.doPick = function(){
		this.pick_timer = 0
		var x = this.pick_x, y = this.pick_y

		if(!this.first_draw_done){
			this.doColor(this.last_time)
		}

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
				view.drawpass.drawPick(last, i + 1, x, y, this.debug_pick)
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
			var data = this.readPixels(x * this.ratio,this.main_frame.size[1] - y * this.ratio, 1, 1)
		}
		else{
			var data = this.readPixels(0, 0, 1, 1)
		}

		// decode the pass and drawid
		var passid = data[0]//(data[0]*43)%256
		var drawid = (((data[2]<<8) | data[1]))//*60777)%65536
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
		this.last_time = time

		if(!this.screen) return

		this.first_draw_done = true

		var stime = (time - this.first_time) / 1000
		//console.log(this.last_time - stime)

		// lets layout shit that needs layouting.
		var anim_redraw = this.anim_redraws
		anim_redraw.length = 0
		this.screen.doAnimation(stime, anim_redraw)

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

		// do the dirty matrix regen
		for(var i = 0; i < this.layout_list.length; i++){
			// lets do a layout?
			var view = this.layout_list[i]
			if(view.matrix_dirty){
				view.updateMatrices(view.parent? view.parent.totalmatrix: undefined, view._viewport)
			}
		}

		var clipview = undefined
		// lets draw draw all dirty passes.
		for(var i = 0, len = this.drawpass_list.length; i < len; i++){

			var view = this.drawpass_list[i]
			var skip = false
			var last = i === len - 1
			if(view.parent == this.screen && view.flex == 1 && this.screen.children.length ===1){
				skip = last = true
			}
			if(view.draw_dirty & 1 || last){

				if(!last){
					if(clipview === undefined) clipview = view
					else clipview = null
				}

				var hastime = view.drawpass.drawColor(last, stime)
				view.draw_dirty &= 2
				if(hastime){
					anim_redraw.push(view)
				}
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

		// console.log('ACTORS', HeadlessApi.stage);
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
			//console.log("FLUSHING ALL")
			// lets put all the drawpasses in a pool for reuse
			for(var i = 0; i < this.drawpass_list.length; i++) {
				var draw = this.drawpass_list[i]
				draw.drawpass.poolDrawTargets()
				draw.layout_dirty = true
				draw.draw_dirth = 3
			}
			this.drawpass_list = []
			this.layout_list = []
			this.drawpass_idx = 0
			this.layout_idx_first = 0
			this.layout_idx = 0
			this.addDrawPassRecursive(node)
			this.first_draw_done = false
			this.redraw()
		}
		else{ // else we remove drawpasses first then re-add them
			this.removeDrawPasses(node)
			this.layout_idx_first = this.layout_idx
			this.addDrawPassRecursive(node)
		}
		node.relayout()
	}

	// internal, remove drawpasses related to a view
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

	// internal, add drawpasses and layouts recursively from a view
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
