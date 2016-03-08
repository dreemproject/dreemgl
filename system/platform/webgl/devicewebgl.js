/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, exports){

	this.Keyboard = require('./keyboardwebgl')
	this.Pointer = require('./pointerwebgl')
	this.Midi = require('./midiwebgl')

	// require embedded classes
	this.Shader = require('./shaderwebgl')
	this.Texture = require('./texturewebgl')

	this.preserveDrawingBuffer = false
	this.premultipliedAlpha = false
	this.antialias = false
	this.debug_pick = false

	this.document = typeof window !== 'undefined'?window : null

	this.atResize = function(){
	}

	this.atDraw = function(time, frameid){
	}

	this.atConstructor = function(previous){

		this.shadercache = previous &&  previous.shadercache || {}

		this.anim_redraws = []
		this.animate_hooks = []
		
		this.frameid = 0

		this.animFrame = function(time){

			if(!this.first_time) this.first_time = time
			if(++this.frameid >= 9007199254740991) this.frameid = 0

			if(this.atDraw( (time - this.first_time) / 1000, this.frameid)){
				this.anim_req = true
				this.document.requestAnimationFrame(this.animFrame)
			}
			else this.anim_req = false
			//if(this.pick_resolve.length) this.doPick()
		}.bind(this)

		if(previous){
			this.canvas = previous.canvas
			this.gl = previous.gl
			this.keyboard = previous.keyboard
			this.pointer = previous.pointer
			this.midi = previous.midi
			this.parent = previous.parent
			this.drawtarget_pools = previous.drawtarget_pools
			this.frame = this.main_frame = previous.main_frame
		}
		else{
			this.frame =
			this.main_frame = this.Texture.fromType('rgb_depth')

			this.keyboard = new this.Keyboard(this)
			this.pointer = new this.Pointer(this)
			this.midi = new this.Midi(this)
			this.drawtarget_pools = {}

			this.createContext()
			this.createWakeupWatcher()
		}
		this.loadExtension('OES_standard_derivatives')
		this.loadExtension('ANGLE_instanced_arrays')

		this.initResize()
	}

	this.createWakeupWatcher = function(){
		var last = Date.now()
		setInterval(function(){
			var now = Date.now()
			if(now - last > 1000 && this.screen){
				this.doresize()
 				this.redraw()
				this.screen.emit('wakeup')
			}
			last = now
		}.bind(this), 200)
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

		// require derivatives and instanced arrays

	}

	this.initResize = function(){
		//canvas.webkitRequestFullscreen()

		var resize = this.doresize = function(){
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

	this.loadExtension = function(name){
		this[name] = this.gl.getExtension(name)
	}

	this.redraw = function(){
		if(this.anim_req) return
		this.anim_req = true
		this.document.requestAnimationFrame(this.animFrame)
	}

	this.clear = function(r,g,b,a){
		var gl = this.gl
		gl.clearColor(r,g,b,a)
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT)
	}

	this.bindFramebuffer = function(frame){
		if(!frame) frame = this.main_frame
		this.frame = frame
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frame.glframe_buf || null)
		this.gl.viewport(0, 0, frame.size[0], frame.size[1])
	}

	this.readPixels = function(x, y, w, h){
		var buf = new Uint8Array(w * h * 4)
		this.gl.readPixels(x , y , w , h, this.gl.RGBA, this.gl.UNSIGNED_BYTE, buf)
		return buf
	}

})
