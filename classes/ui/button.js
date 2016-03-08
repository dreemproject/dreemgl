/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/


define.class('$ui/view', function(require, $ui$, view, label, icon){
// Simple gradient button: a rectangle with a textlabel and an icon

	this.attributes = {
		// The label for the button
		text: Config({type: String, value: ""}),

		// The icon for the button, see FontAwesome for the available icon-names.
		icon: Config({type: String, value: "", meta:"icon"}),

		// Font size in device-pixels.
		fontsize: Config({type: float, value: 14, meta:"fontsize"}),

		// Gradient color 1
		col1: Config({meta:"color", type:vec4, value: vec4("#272727"), duration: 0.1, motion:"linear"}),

		// Gradient color 2
		col2: Config({meta:"color", type: vec4, value: vec4("#272727"), duration: 0.1, motion:"linear"}),

		// Color of the label text in neutral state
		textcolor: Config({meta:"color", type: vec4, value: vec4("white")}),

		// Color of the label text in pressed-down state
		textactivecolor: Config({meta:"color", type: vec4, value: vec4("white")}),

		// First gradient color for the button background in neutral state
		buttoncolor1: Config({meta:"color", type: vec4, value: vec4("#636363")}),

		// Second gradient color for the button background in neutral state
		buttoncolor2: Config({meta:"color", type: vec4, value: vec4("#636363")}),

		// First gradient color for the button background in hovered state
		hovercolor1: Config({meta:"color", type: vec4, value: vec4("#c5c5c5")}),

		// Second gradient color for the button background in hovered state
		hovercolor2: Config({meta:"color", type: vec4, value: vec4("#797979")}),

		// First gradient color for the button background in pressed state
		pressedcolor1: Config({meta:"color", type: vec4, value: vec4("#707070")}),

		// Second gradient color for the button background in pressed state
		pressedcolor2: Config({meta:"color", type: vec4, value: vec4("#707070")}),

		// Second gradient color for the button background in pressed state
		internalmargin: Config({meta:"ltrb", type: vec4, value: vec4(0,0,0,0)}),

		// fires when button is clicked
		click: Config({type:Event}),

		bold: true,
		enabled: true,
		defaultbutton: false,

		bgcolor: '#636363',
		fgcolor: 'white',
		padding: 2,
		borderradius: 7,
		borderwidth: 2,
		margin: 0,
		bordercolor: vec4("#636363"),
		pickalpha:-1,
		iconmargin:4,

		alignitems: "center",
		justifycontent: "center"
	}

	this.style = {
		icon:{
			alignself:"center",
			fgcolor:  Config({motion:'linear', duration:0.1})
		},
		label:{
			subpixel:false,
			alignself:"center",
			position: "relative",
			bgcolor:NaN
		},
		view_wrap:{
			bgcolor:NaN,
			alignitems:"center",
			flexdirection:"row",
			justifycontent:"center"
		}
	}

	//this.buttonres = {};
	this.font = require('$resources/fonts/opensans_bold_ascii.glf')

	this.onbold = function(){
		if (this.bold) {
			this.font = require('$resources/fonts/opensans_bold_ascii.glf')
		}
		else{
			this.font = require('$resources/fonts/opensans_regular_ascii.glf')
		}
	}

	// Set the background
	// vec2 pos: position
	// return;
	this.bgcolorfn = function(pos){
		return mix(col1, col2, pos.y)
	}

	this.setTextColor = function(color) {
		if (this.iconres) this.iconres.fgcolor = color;
		if (this.buttonres) this.buttonres.fgcolor = color;
	}

	// the hover state when someone hovers over the button
	this.statehover = function(){
		this.col1 = this.hovercolor1;
		this.col2 = this.hovercolor2;
		this.shadowopacity = 1.0;
		this.setTextColor(this.textactivecolor)
	}

	// the normal button state
	this.statenormal = function(first) {
		this.col1 = Mark(this.buttoncolor1, first);
		this.col2 = Mark(this.buttoncolor2, first);
		this.shadowopacity = 0.0
		this.setTextColor(this.textcolor)
	}

	// clicked state
	this.stateclick = function(){
		this.col1 = this.pressedcolor1;
		this.col2 = this.pressedcolor2;
		this.setTextColor(this.textactivecolor)
	}

	this.init = function(){
		this.statenormal(true)
	}

	this.pointerover = function(){
		this._isover = true
		this.statehover()
	}

	this.pointerout = function(){
		this._isover = false
		this.statenormal()
	}

	this.pointerstart = function(){
		this.stateclick()
	}

	this.pointerend = function(event){
		if (event.isover){
			this.statehover();
			this.emit('click',event)
		}
		else{
			this.statenormal()
		}
	}

	this.buildIconRes = function() {
		return icon({
			drawtarget:"color",
			fgcolor:this.textcolor,
			fontsize: this.fontsize,
			icon: this.icon
		})
	};

	this.buildButtonRes = function(iconres) {
		return label({
			drawtarget:"color",
			marginleft: iconres ? this.iconmargin : 0,
			fontsize: this.fontsize,
			fgcolor:this.textcolor,
			text: this.text
		})
	};

	this.render = function(){
		if (this.constructor_children.length > 0) return this.constructor_children;
		var res = []
		this.buttonres = undefined
		this.iconres = undefined

		if (this.icon && this.icon.length > 0){
			this.iconres = this.buildIconRes();
			res.push(this.iconres)
		}

		if (this.text && this.text.length > 0){
			this.buttonres = this.buildButtonRes(this.iconres);
			res.push(this.buttonres)
		}

		return view({class:'wrap',margin:this.internalmargin},res)
	}

	var button = this.constructor
	// Basic usage of the button.
	this.constructor.examples = {
		Usage:function(){
			return [
				button({text:"Press me!"}),
				button({text:"Colored!", buttoncolor1: "red", buttoncolor2: "blue", labelcolor: "white"  }),
				button({text:"With an icon!", icon:"flask" })
			]
		}
	}
})
