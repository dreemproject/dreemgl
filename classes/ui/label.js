/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class(function(require, $ui$, view){	

//	require("$fonts/arial_bold.glf")

	var TypeFace = require('$system/typeface/typefaceshader')

	this.bgcolor = vec4("transparent")

	this.attributes = {
		// the text color
		fgcolor: {type:vec4, value: vec4(1,1,1,1), meta:"color" },
	
		// The string to display.
		text: {type:String, value: "text" },
	
		// Size of the font in pixels
		fontsize: {type:float, value: 18, meta:"fontsize"},
	
		// the boldness of the font (try values 0 - 1)
		boldness: {type:float, value: 0.},

		// reference to the font typeface, require it with require('font:')
		font: {type:Object, value: undefined, meta:"font"},
	
		// Should the text wrap around when its width has been reached?
		multiline: {type:Boolean, value: false },

		// turn on subpixel aa, this requieres a bgcolor to be present
		subpixel: {type:Boolean, value: false},
	
		// Alignment of the bodytext.
		align: {type: Enum('left','right','center', 'justify'),  value: "left"}
	}

	// the normal font 
	define.class(this, 'typefacenormal', TypeFace, function(){
		this.updateorder = 3
		this.draworder = 5
		this.subpixel = false
		this.update = function(){
			var view = this.view
			
			var mesh = this.newText()
			if(view.typeface) mesh.typeface = view.typeface

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
			if(view.measure_with_cursor){
				mesh.computeBounds(true)
			}
			this.mesh = mesh
		}
	})
	this.typefacenormal = false

	// the subpixel font used to render with subpixel antialiasing
	define.class(this, 'typefacesubpixelaa', this.typefacenormal, function(){
		this.subpixel = true
		this.boldness = 0.6
	})
	this.typefacesubpixelaa = false

	// the font which is set to fontsubpixelaa and fontnormal depending on the value of subpixel
	define.class(this, 'typeface', this.typefacenormal, function(){
	})

	this.subpixel = function(event){
		if(this._subpixel){

			this.typeface = this.typefacesubpixelaa
		}
		else{
			this.typeface = this.typefacenormal
		}
	}

	this.measure_with_cursor = false
	this.bgcolor = vec4("white")

	this.init = function(){
	}
	
	this.measure = function(width){
		if(this.typefaceshader.update_dirty){
			this.typefaceshader.update()
			this.typefaceshader.update_dirty = true
		}
		return {width: this.measured_width = this.typefaceshader.mesh.bound_w, height: this.measured_height =this.typefaceshader.mesh.bound_h};
	}

	var label = this.constructor
	// A label.
	this.constructor.examples = {
		Usage: function(){
			return [label({text:"I am a textlabel!", fgcolor:"purple", fontsize: 30 })]
		}
	}
})