/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class(function( $ui$, view, label, icon, $$, require){
	// Simple button: a rectangle with a textlabel and an icon
	
	this.attributes = {
		// The label for the button
		text: {type: String, value: ""},

		// The icon for the button, see FontAwesome for the available icon-names.
		icon: {type: String, value: "", meta:"icon"},

		// Font size in device-pixels.
		fontsize: {type: float, value: 14, meta:"fontsize"},
		
		// Gradient color 1	
		col1: {meta:"color", type: vec4, value: vec4("#272727"), duration: 0.1, motion:"linear"},
		
		// Gradient color 2
		col2: {meta:"color", type: vec4, value: vec4("#272727"), duration: 0.1, motion:"linear"},

		// Color of the label text in neutral state	
		textcolor: {meta:"color", type: vec4, value: vec4("white")},

		// Color of the label text in pressed-down state	
		textactivecolor: {meta:"color", type: vec4, value: vec4("white")},
		
		// First gradient color for the button background in neutral state
		buttoncolor1: {meta:"color", type: vec4, value: vec4("#272727")},
		
		// Second gradient color for the button background in neutral state	
		buttoncolor2: {meta:"color", type: vec4, value: vec4("#272727")},
		
		// First gradient color for the button background in hovered state
		hovercolor1: {meta:"color", type: vec4, value: vec4("#505050")},
		
		// Second gradient color for the button background in hovered state
		hovercolor2: {meta:"color", type: vec4, value: vec4("#505050")},
		
		// First gradient color for the button background in pressed state
		pressedcolor1: {meta:"color", type: vec4, value: vec4("#707070")},
		
		// Second gradient color for the button background in pressed state
		pressedcolor2: {meta:"color", type: vec4, value: vec4("#707070")},

		// Second gradient color for the button background in pressed state
		internalmargin: {meta:"tlbr", type: vec4, value: vec4(0,0,0,0)},

		// fires when button is clicked
		click:Event
	}

	var button = this.constructor
								
	this.bgcolor = '#272727'
	this.fgcolor = 'white'
	this.buttonres = {};
	this.padding = 2
	this.borderradius = 3
	this.borderwidth  = 2
	this.margin = 0
	this.bordercolor = vec4("#272727")
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
		this.bg = 0
	})

	// the hover state when someone hovers over the button
	this.statehover = function(){
		this.col1 = this.hovercolor1
		this.col2 = this.hovercolor2
		if(this.iconres)this.iconres.fgcolor = this.textactivecolor
	}

	// the normal button state
	this.statenormal = function(){
		this.col1 = this.buttoncolor1
		this.col2 = this.buttoncolor2
		if(this.iconres)this.iconres.fgcolor = this.textcolor
	}

	// clicked state
	this.stateclick = function(){
		//this.animate({col1:{0:vec4('red'),3:vec4('green')}})
		this.col1 = this.pressedcolor1
		this.col2 = this.pressedcolor2
		if(this.iconres)this.iconres.fgcolor = this.textactivecolor
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
		
		var res = [];
		this.buttonres = undefined;
		this.iconres = undefined
		
		if (this.text && this.text.length > 0){
			
			this.buttonres = this.labelclass({font: require('$resources/fonts/opensans_bold_ascii.glf'), bgcolor:this.bgcolor, fgcolor:this.fgcolor, nopick:true,fontsize: this.fontsize, position: "relative", text: this.text})
			res.push(this.buttonres);
		}
		
		if (this.icon && this.icon.length > 0){
			this.iconres = this.iconclass({fontsize: this.fontsize, nopick:true, fgcolor:this.fgcolor, icon: this.icon}); 
			res.push(this.iconres);
		}
		return view({bg:0, padding:0, margin:this.internalmargin},res);

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