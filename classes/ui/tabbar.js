/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class("$ui/view", function($ui$, view, label, icon){
// Presents a bar of configurable tabs

	this.defaultselectionhandler = function(tab) {
		if (tab.parent.selection) {
			tab.parent.selection.state = "normal";
		}
		tab.parent.selection = tab;
	};

	this.attributes = {

		// Tab definitions.  This can be a simple list of strings or and array of more complicated
		// objects that describe tab behavior in detail.
		tabs:Config({type:Array, value:[]}),

		// Color of default tabs, can be overridden in style
		tabcolor: Config({value:vec4(0,0,0,1), meta:"color" }),

		// Current tab selection
		selection:Config({type:Object}),

		// Default tab states if none provided in the tab defintions.
		states:Config({type:Object, value:{
			normal:{
				fgcolor:"#aaa",
				on:undefined
			},
			hover:{
				fgcolor:"#eee",
				on:undefined
			},
			active:{
				fgcolor:"#fff",
				on:undefined
			},
			selected:{
				fgcolor:"#69f",
				on:this.defaultselectionhandler
			},
			disabled:{
				fgcolor:"darkgray",
				on:undefined
			}}
		})
	};

	this.tooldragroot = true;
	this.flexdirection = "row";
	this.bgcolor = NaN;

	this.style = {
		tab: {
			flex: 1,
			bgcolor:this.tabcolor,
			arrowheight:5.0,
			showarrow:true,
			bgcolorfn:function(p) {
				var atx = p.x * layout.width;
				var aty = p.y * layout.height;
				if (showarrow && aty < arrowheight && (atx + aty < layout.width * 0.5 || atx - aty > layout.width * 0.5)) {
					return "transparent"
				} else {
					return bgcolor;
				}
			}
		},
	    tab_folder: {
			y:1,
			flex: 0,
			bgcolor:this.tabcolor,
			borderradius:vec4(15,15,0,0),
			bgcolorfn:function(p) { return bgcolor; }
		}
	};

	this.render = function() {
		var tabs = [];
		var i,tab;
		if (this.constructor_children) {
			for (i=0;i<this.constructor_children.length;i++) {
				tab = this.constructor_children[i];
				tabs.push(tab);
			}
		}

		if (this.tabs) {
			for (i=0;i<this.tabs.length;i++) {
				var tabdef = this.tabs[i];

				var tab;
				if (typeof(tabdef) === "string") {
					tab = this.tab({ label:tabdef })
				} else {
					tab = this.tab(tabdef)
				}

				tabs.push(tab);
			}
		}

		return tabs;
	};

	define.class(this, "tab", view, function() {
		this.attributes = {

			// Image that floats inside the tab (as opposed to a bgimage).
			image:Config({type:String}),

			// Foreground color of any label or icon text.
			fgcolor: Config({value:vec4(1,1,1,1), meta:"color" }),

			// reference to the font typeface, require it with require('font:')
			font: Config({type:Object, meta:"font"}),

			// Size of the font in pixels
			fontsize: Config({type:float, value: 18, meta:"fontsize"}),

			// Use a bold font
			bold: false,

			// The boldness of the font (values 0 - 1)
			boldness: Config({type:float, value: 0.0}),

			// Text to display in tab.
			label:Config({type:String}),

			// Icon to display in tab.
			icon:Config({type:String}),

			// Tab display state.  Changing this can have side effects if `on` functions are provided
			state:Config({type:Enum("normal", "hover", "active", "selected", "disabled"), value:"normal"}),

			// Configuration for normal state
			normal:Config({type:Object}),

			// Configuration for active/pressed state
			active:Config({type:Object}),

			// Configuration for hover state
			hover:Config({type:Object}),

			// Configuration for selected state
			selected:Config({type:Object}),

			// Configuration for disabled state
			disabled:Config({type:Object})
		};

		this.justifycontent = "center";
		this.alignitems = "center";

		this.init = function() {
			this.onstate(null, this.state, this);
		};

		this.onstate = function(ev,v,o) {

			var defaultstates = this.outer.states || {};
			var defaultstate = defaultstates[v] || {};
			var state = this[v] || defaultstate;

			var keys = [];

			for (var skey in state) {
				if (state.hasOwnProperty(skey)) {
					if (keys.indexOf(skey) < 0) {
						keys.push(skey);
					}
				}
			}

			for (var dkey in defaultstate) {
				if (defaultstate.hasOwnProperty(dkey)) {
					if (keys.indexOf(dkey) < 0) {
						keys.push(dkey);
					}
				}
			}

			for (var i=0;i<keys.length;i++) {
				var key = keys[i];
				var val = state[key];
				if (typeof(val) === "undefined") {
					val = defaultstate[key];
				}
				//console.log('setting property', key, 'to', val, 'for state', v);
				this[key] = val;
			}

			if (this.on) {
				this.on(this, v);
			}
		};

		this.pointerstart = function(ev) {
			if (this.state !== "disabled") {
				this.state = "active";
			}
		};

		this.pointerhover = function(ev) {
			if (this.state === "normal") {
				this.state = "hover";
			}
		};

		this.pointerout = function(ev) {
			if (this.state === "hover") {
				this.state = "normal";
			}
		};

		this.pointerend = function(ev) {
			if (this.state === "active") {
				this.state = "selected";
			}
		};

		this.render = function() {
			var views = [];

			if (this.icon) {
				views.push(icon({
					fgcolor:this.fgcolor,
					drawtarget:"color",
					icon:this.icon,
					fontsize:this.fontsize,
					boldness:this.boldness,
					padding:5,
					bgcolor:NaN
				}))
			}

			if (this.image) {
				views.push(view({
					bgimage:this.image,
					drawtarget:"color",
					padding:5,
					bgcolor:NaN
				}))
			}

			if (this.label) {
				views.push(label({
					fgcolor:this.fgcolor,
					drawtarget:"color",
					text:this.label,
					font:this.font,
					fontsize:this.fontsize,
					bold:this.bold,
					boldness:this.boldness,
					padding:5,
					bgcolor:NaN
				}))
			}

			return views;
		};
	});

	var tabbar = this.constructor;
	this.constructor.examples = {
		Usage: function() {
			return [
				tabbar({tabs:["one", "two", "three"], onselection:function(ev,tab,bar) {
					if (tab) {
						console.log('Selected', tab.text)
					}
				}})
			]
		},
		Advanced: function() {

			var selectionhandler = function(tab,state) {
				tab.parent.defaultselectionhandler(tab);
				alert("custom logic for " + state + " handler can go here")
			};

			return [
				tabbar({tabs:[
					{
						class:"folder",
						normal:{
							icon:"gear",
							fgcolor:"gray"
						},
						hover:{
							fgcolor:"lightblue"
						},
						active:{
							fgcolor:"lightgreen"
						},
						selected:{
							fgcolor:"red"
						},
						disabled:{
							fgcolor:"pink"
						}
					},
					{
						class:"folder",
						label:"two",
						bgcolor:"#114",
						bold:true,
						selected:{ on:selectionhandler }
					},
					{
						class:"folder",
						label:"three",
						state:"disabled",
						disabled:{
							bgcolor:"gray",
							fgcolor:"darkgray"
						}
					}
				]})
			]
		}

	}
});
