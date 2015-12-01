/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $containers$, view){	
	// Text label!
	var Font = require('$system/font/fontshader')

	var glfontParser = require('$system/font/fontparser')

	this.bgcolor = vec4("transparent")

	this.attributes = {
		fgcolor: {type:vec4, value: vec4(1,1,1,1)},
	
		// The string to display.
		text: {type:String, value: "text" },
	
		// Size of the font in pixels
		fontsize: {type:float, value: 18},
	
		boldness: {type:float, value: 0.2},

		// Name of the font
		typeface: {type:Object, value: undefined},
	
		// Should the text wrap around when its width has been reached?
		multiline: {type:Boolean, value: false },

		// turn on subpixel aa
		subpixel: {type:Boolean, value: false},
	
		// Alignment of the bodytext. 
		align: {type: String,  value: "left"}
	}

	define.class(this, 'fontnormal', Font, function(){
		this.subpixel = false
		this.update = function(){
			var view = this.view
			
			var mesh = this.newText()

			if(this.typeface) mesh.typeface = this.typeface

			mesh.fontsize = view.fontsize
			mesh.boldness = view.boldness
			mesh.add_y = mesh.line_height
			mesh.align = view.align
			mesh.start_y = mesh.line_height
			mesh.clear()

			if (this.multiline){
				mesh.addWithinWidth(text, maxwidth? maxwidth: this.layout.width)
			}
			else{
				mesh.add(view.text,0 ,0 ,0)
			}
			this.mesh = mesh
		}
	})
	this.fontnormal = false

	define.class(this, 'fontsubpixelaa', this.fontnormal, function(){
		this.subpixel = true
		this.boldness = 0.6
	})
	this.fontsubpixelaa = false

	define.class(this, 'font', this.fontnormal, function(){

	})

	this.subpixel = function(event){
		if(this._subpixel){

			this.font = this.fontsubpixelaa
		}
		else{
			this.font = this.fontnormal
		}
	}

	// enable it
	this.font = 5

	this.bgcolor = vec4("white")

	this.init = function(){
		if(this.typeface) this.typeface = glfontParser(this.typeface)
	}
	
	//!TODO make this also run the listeners
	this.measure = function(width){
		if(this.fontshader.update_dirty){
			this.fontshader.update()
			this.fontshader.update_dirty = true
		}
		return {width: this.measured_width =this.fontshader.mesh.bound_w, height: this.measured_height =this.fontshader.mesh.bound_h};
	}

	var label = this.constructor
	// A label.
	this.constructor.examples = {
		Usage: function(){
			return [label({text:"I am a textlabel!", fgcolor:"purple", fontsize: 30 })]
		}
	}
})