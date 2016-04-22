/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/

define.class("../webgl/devicewebgl", function(require, exports, baseclass){

	this.Keyboard = require('./keyboardnodegl')
	this.Pointer = require('./pointernodegl')

	// require embedded classes
	this.Shader = require('./shadernodegl')
	this.Texture = require('./texturenodegl')
	this.DrawPass = require('./drawpassnodegl')

	var WebGL = require('node-webgl/lib/webgl')
	var Image = this.Image = require('node-webgl/lib/image')
	var GLFW = require('node-glfw')

	this.atConstructor = function(){
		this.window = 
		this.document = this
		baseclass.atConstructor.call(this)
	}

	// make a fake window/document interface
	this.addEventListener = function(name, callback){
		if(!callback) throw new Error('invalid listener')
		this['on' + name] = callback
	}

	this.removeEventListener = function (name, callback) {
		if (callback && typeof(callback) === "function") {
			this['on' + name] = undefined
		}
	}

	this.requestAnimationFrame = function (callback, delay) {
		this.req_anim_frame = callback
    }

	this.Texture.Image = Image

	// create nodegl context
	this.createContext = function(){

		var width = 800, height = 600

		if (process.platform !== 'win32') process.on('SIGINT', function () { 
			process.exit(0)
		})
		
		GLFW.Init()
		
		GLFW.events.on('mousemove', function(event){
			event.pageX = event.x, event.pageY = event.y
			if(this.onmousemove) this.onmousemove(event)
		}.bind(this))

		GLFW.events.on('mousedown', function(event){
			event.pageX = event.x, event.pageY = event.y
			if(this.onmousedown) this.onmousedown(event)
		}.bind(this))

		GLFW.events.on('mouseup', function(event){
			event.pageX = event.x, event.pageY = event.y
			if(this.onmouseup) this.onmouseup(event)
		}.bind(this))

		GLFW.events.on('keydown', function(event){
			if(this.onkeydown) this.onkeydown(event)
		}.bind(this))

		GLFW.events.on('keyup', function(event){
			if(this.onkeyup) this.onkeyup(event)
		}.bind(this))

		GLFW.events.on('quit', function () { 
			process.exit(0)
		})

		GLFW.events.on("keydown", function (evt) {
			if (evt.keyCode === 'C'.charCodeAt(0) && evt.ctrlKey) { process.exit(0); }// Control+C
			if (evt.keyCode === 27) process.exit(0);  // ESC
		});

		GLFW.DefaultWindowHints()
		GLFW.WindowHint(GLFW.RESIZABLE, 1)
		GLFW.WindowHint(GLFW.VISIBLE, 1)
		GLFW.WindowHint(GLFW.DECORATED, 1)
		GLFW.WindowHint(GLFW.RED_BITS, 8)
		GLFW.WindowHint(GLFW.GREEN_BITS, 8)
		GLFW.WindowHint(GLFW.BLUE_BITS, 8)
		GLFW.WindowHint(GLFW.DEPTH_BITS, 24)
		GLFW.WindowHint(GLFW.REFRESH_RATE, 0)

		if (!(this.glfwindow = GLFW.CreateWindow(width, height))) {
			GLFW.Terminate()
			throw "Can't initialize GL surface"
		}

		GLFW.MakeContextCurrent(this.glfwindow)

		GLFW.SetWindowTitle(this.glfwindow,"WebGL")

		// make sure GLEW is initialized
		WebGL.Init()
		this.gl = WebGL

		this.clear(0,0,0,1.)
  		GLFW.SwapBuffers(this.glfwindow)

		GLFW.SwapInterval(1)

		//for (var l = 0, ln = resizeListeners.length; l < ln; ++l)
		GLFW.events.addListener("framebuffer_resize", function(){
			this.doSize()
			//this.redrawCall()
		}.bind(this))

		this.getExtension('OES_standard_derivatives')

  		this.doSize()
  		var last_anim, last_time 
  		this.redrawCall = function(){
 			if(last_anim) GLFW.SwapBuffers(this.glfwindow)
			GLFW.PollEvents()
			// renderloop	        
			var anim_frame = last_anim = this.req_anim_frame
			if(anim_frame){
				this.req_anim_frame = undefined
				var time = GLFW.GetTime()
				//console.log((last_time - time)*1000)
				last_time = time
				anim_frame(time*1000)
			}

  		}

        setInterval(function(){
        	this.redrawCall()
        }.bind(this), 0)
    }

	this.doSize = function(width, height){
		var sizeWin = GLFW.GetWindowSize(this.glfwindow)
		var sizeFB = GLFW.GetFramebufferSize(this.glfwindow)

		this.ratio = sizeFB.width / sizeWin.width
		this.width = sizeWin.width
		this.height = sizeWin.height
		//var sw = width
		//var sh = height
		this.gl.viewport(0, 0, sizeFB.width, sizeFB.height)
		// store our w/h and pixelratio on our frame
		this.main_frame.ratio = this.ratio
		this.size = vec2(sizeWin.width, sizeWin.height)
		this.main_frame.size = vec2(sizeFB.width, sizeFB.height) // actual size
		//this.ratio = this.main_frame.ratio
		this.atResize ()
	}

	this.initResize = function(){
	}

})
