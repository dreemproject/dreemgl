/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function(view,icon){
	// Simple button: a rectangle with a textlabel and an icon
	
	this.attributes = {
		// The label for the button
		text: {type: String, value: ""},

		// Font size in device-pixels.
		fontsize: {type: float, value: 14},
			
		// Gradient color 1	
		col1: {meta:"color", type: vec4, value: vec4("#404040"), duration: 1.0},
		// Gradient color 2
		col2: {meta:"color", type: vec4, value: vec4("#404040"), duration: 1.0},

		// Color of the label text in neutral state	
		textcolor: {meta:"color", type: vec4, value: vec4("#404040")},
		
		// Color of the label text in pressed-down state			
		textactivecolor: {meta:"color", type: vec4, value: vec4("green")},
		
		// First gradient color for the button background in neutral state
		buttoncolor1: {meta:"color", type: vec4, value: vec4("#fffff0")},
		// Second gradient color for the button background in neutral state	
		buttoncolor2: {meta:"color", type: vec4, value: vec4("#ffffff")},
		
		// First gradient color for the button background in hovered state
		hovercolor1: {meta:"color", type: vec4, value: vec4("#f0f0f0")},
		// Second gradient color for the button background in hovered state
		hovercolor2: {meta:"color", type: vec4, value: vec4("#f8f8f8")},
		
		// First gradient color for the button background in pressed state
		pressedcolor1: {meta:"color", type: vec4, value: vec4("#d0d0f0")},
		// Second gradient color for the button background in pressed state
		pressedcolor2: {meta:"color", type: vec4, value: vec4("#d0d0f0")},

		// fires when button is clicked
		click:Event,
		value:{type:Boolean, value:false}
	}

	
	this.click = function(){		
		this.value  = this.value?false:true;
	}
	
	var button = this.constructor

	this.bgcolor = 'white'
	this.fgcolor = 'black'
	this.buttonres = {};
	this.padding = 8
	this.borderradius = 3
	this.borderwidth  = 2
	this.margin = 4
	this.bordercolor = vec4("lightgray")
	this.alignItems = "center"

	this.bg = {
		color: function(){
			return mix(view.col1, view.col2, (uv.y)/0.8)
		}
	}

	// The icon class used for the icon display. Exposed to allow overloading/replacing from the outside.
	define.class(this, 'iconclass', function(icon){
		this.attributes = {
			fgcolor:{motion:'linear', duration:0.1}
		}
	})

	// The icon class used for the icon display. Exposed to allow overloading/replacing from the outside.
	define.class(this, 'labelclass', function(label){
		this.subpixel = false
		this.fontsubpixelaa =  {
			boldness:0.9
		}
		this.bg = 0
	})

	// the hover state when someone hovers over the button
	this.statehover = function(){
		this.col1 = this.hovercolor1
		this.col2 = this.hovercolor2
	}

	// the normal button state
	this.statenormal = function(){
		this.col1 = this.buttoncolor1
		this.col2 = this.buttoncolor2
	}

	// clicked state
	this.stateclick = function(){
		//this.animate({col1:{0:vec4('red'),3:vec4('green')}})
		this.col1 = this.pressedcolor1
		this.col2 = this.pressedcolor2
	}

	this.init = function(){
		this.statenormal()
	}

	this.mouseover = function(){this.statehover()}
	this.mouseout = function(){this.statenormal()}
	this.mouseleftdown = function(){this.stateclick()}
	this.mouseleftup = function(event){
		// lets check if its over the button
		this.statenormal()
		if(event.isover){
			this.emit('click',event)
		}
	}

	this.render = function(){
		
			this.iconres = this.iconclass({fontsize: this.fontsize, nopick:true, fgcolor:this.value?this.fgcolor:vec4("transparent"), icon: "check"}); 
			return [this.iconres]
		
	}

	// Basic usage of the button.	
	this.constructor.examples = {
		Usage:function(){
			return [
				button({text:"Press me!"})
				,button({text:"Colored!", buttoncolor1: "red", buttoncolor2: "blue", labelcolor: "white"  })
				,button({text:"With an icon!", icon:"flask" })
			]
		}
	}	
})