/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function($containers$view, label, icon){
	// Simple button: a rectangle with a textlabel and an icon
	
	this.attributes = {
		// The label for the button
		text: {type: String, value: ""},
		// The icon for the button, see FontAwesome for the available icon-names.
		icon: {type: String, value: ""},

		// Font size in device-pixels.
		// Example: example1
		fontsize: {type: float, value: 14},
		
		// Gradient color 1	
		col1: {type: vec4, value: vec4("#404040"), duration: 1.0},
		// Gradient color 2
		col2: {type: vec4, value: vec4("#404040"), duration: 1.0},

		// Color of the label text in neutral state	
		textcolor: {type: vec4, value: vec4("#404040")},

		// Color of the label text in pressed-down state	
		textactivecolor: {type: vec4, value: vec4("green")},
		
		// First gradient color for the button background in neutral state
		buttoncolor1: {type: vec4, value: vec4("#fffff0")},
		// Second gradient color for the button background in neutral state	
		buttoncolor2: {type: vec4, value: vec4("#ffffff")},
		
		// First gradient color for the button background in hovered state
		hovercolor1: {type: vec4, value: vec4("#f0f0f0")},
		// Second gradient color for the button background in hovered state
		hovercolor2: {type: vec4, value: vec4("#f8f8f8")},
		
		// First gradient color for the button background in pressed state
		pressedcolor1: {type: vec4, value: vec4("#d0d0f0")},
		// Second gradient color for the button background in pressed state
		pressedcolor2: {type: vec4, value: vec4("#d0d0f0")},

		// fires when button is clicked
		click:Event
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


	this.statehover = function(){

		this.col1 = this.hovercolor1
		this.col2 = this.hovercolor2
		if(this.iconres)this.iconres.fgcolor = this.textactivecolor
	}

	this.statenormal = function(){
		this.col1 = this.buttoncolor1
		this.col2 = this.buttoncolor2
		if(this.iconres)this.iconres.fgcolor = this.textcolor
	}

	this.stateclick = function(){
		//this.animate({col1:{0:vec4('red'),3:vec4('green')}})
		this.col1 = this.pressedcolor1
		this.col2 = this.pressedcolor2
		if(this.iconres)this.iconres.fgcolor = this.textactivecolor
	}

	this.init = this.statenormal
	this.mouseover  = this.statehover
	this.mouseout = this.statenormal
	this.mouseleftdown = this.stateclick
	this.mouseleftup = function(pos){
		// lets check if its over the button
		this.statenormal()
		if(pos.flags && pos.flags.over){
			this.emit('click',pos)
		}
	}

	this.render = function(){
		this.buttonres =  this.labelclass({bgcolor:this.bgcolor, fgcolor:this.fgcolor, nopick:true, marginleft: 4,fontsize: this.fontsize, position: "relative", text: this.text})
		if (!this.icon || this.icon.length == 0){
			this.iconres = undefined
			return [this.buttonres]
		} 
		else {
			this.iconres = this.iconclass({fontsize: this.fontsize, nopick:true, fgcolor:this.fgcolor, icon: this.icon}); 
			return [this.iconres, this.buttonres]
		}
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