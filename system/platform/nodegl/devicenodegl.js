/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class("../webgl/devicewebgl", function(require, exports, self){

	this.Keyboard = require('./keyboardnodegl')
	this.Mouse = require('./mousenodegl')
	this.Touch = require('./touchnodegl')

	// require embedded classes	
	this.Shader = require('./shadernodegl')

	this.Shader.prototype.set_precision = false
	
	this.Texture = require('./texturenodegl')
	this.DrawPass = require('./drawpassnodegl')

	var WebGL = require('node-webgl')
  	var Image = WebGL.Image
	this.document = WebGL.document()
	this.Texture.Image = Image

	// create nodegl context
	this.createContext = function(){
		// lets create a nodegl context
		this.canvas = this.document.createElement("canvas",800,600);
		this.document.setTitle("DreemGL")
	    this.gl = this.canvas.getContext("experimental-webgl");
    	this.gl.viewportWidth = this.canvas.width;
  		this.gl.viewportHeight = this.canvas.height;
  		this.doSize()
	}

	this.doSize = function(){
		var sw = this.canvas.width
		var sh = this.canvas.height
		this.gl.viewport(0, 0, sw, sh)
		// store our w/h and pixelratio on our frame
		this.main_frame.ratio = 2
		this.main_frame.size = vec2(sw, sh) // actual size
		this.size = vec2(sw, sh)
		this.ratio = this.main_frame.ratio
	}

	this.initResize = function(){
		this.document.on("resize", function (evt) {
			this.canvas.width = evt.width * this.main_frame.ratio;
			this.canvas.height = evt.height * this.main_frame.ratio;
			this.doSize()
			this.relayout()
		}.bind(this))
	}

})