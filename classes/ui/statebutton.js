/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/


define.class('$ui/view', function(require, $ui$, view, label, icon){
// A button


	this.clickhandler = function(ev, v, o) {
		if (ev) {
			if (this.mode === "toggle") {
				ev.view = this;
				ev.value = this.state === "selected";
				this.emit('toggle', ev);
			} else {
				this.state = "hover";
				this.onstate(ev, this.state, o);
				ev.view = this;
				ev.value = 'click';
				this.emit('click', ev);
			}
		}
	};

	this.attributes = {

		// fires when button is clicked
		click: Config({type:Event}),

		// fires when button is toggled
		toggle: Config({type:Event}),

		mode:Config({type:Enum("click", "toggle"), value:"click"}),

		// Image that floats inside the button (as opposed to it's bgimage).
		image:Config({type:String}),

		// Foreground color of any label or icon text.
		fgcolor: Config({value:vec4(0.3,0.3,0.3,1), meta:"color" }),

		// reference to the font typeface, require it with require('font:')
		font: Config({type:Object, meta:"font"}),

		// Size of the font in pixels
		fontsize: Config({type:float, value: 18, meta:"fontsize"}),

		// Use a bold font on label
		bold: true,

		// The boldness of the label font (values 0 - 1)
		boldness: Config({type:float, value: 0.0}),

		// Text to display in button's label.
		label:Config({type:String, value:""}),

		// deprecated
		text:Config({type:String, value:""}),

		// Icon to display in button.
		icon:Config({type:String}),

		// Tab display state.  Changing this can have side effects if `on` functions are provided
		state:Config({type:Enum("normal", "hover", "active", "selected", "disabled"), value:"normal", persist:true}),

		defaultstates:Config({type:Object, value:{
			normal:{
//				fgcolor:"#333",
				on:undefined
			},
			hover:{
//				fgcolor:"#888",
				on:undefined
			},
			active:{
//				fgcolor:"#aaa",
				on:undefined
			},
			selected:{
//				fgcolor:"#69f",
				on:this.clickhandler
			},
			disabled:{
				fgcolor:"darkgray",
				on:undefined
			}}
		}),

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

	this.ontext = function(ev,v,o) {
		console.error('.text is deprecated for button, please use .label');
		this.label = v;
	};

	this.onstate = function(ev,v,o) {

		var defaultstates = this.defaultstates || {};
		var defaultstate = defaultstates[v] || {};
		var state = this[v] || defaultstate;

		var keys = [];
		if (typeof(state) === "function") {
			var k = state.call(this,v,state);
			if (k && Array.isArray(k)) {
				keys = keys.concat(k)
			}
		} else {
			for (var skey in state) {
				if (state.hasOwnProperty(skey)) {
					if (keys.indexOf(skey) < 0) {
						keys.push(skey);
					}
				}
			}
		}

		if (typeof(defaultstate) === "function") {
			var dk = defaultstate.call(this,v,defaultstate);
			if (dk && Array.isArray(dk)) {
				keys = keys.concat(dk)
			}
		} else {
			for (var dkey in defaultstate) {
				if (defaultstate.hasOwnProperty(dkey)) {
					if (keys.indexOf(dkey) < 0) {
						keys.push(dkey);
					}
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

		this.class = v;

		if (this.on) {
			this.on.call(this, ev, v, o);
		}
	};

	this.pointerstart = function(ev) {
		if (this.state !== "disabled") {
			if (this.mode === "toggle" && this.state === "selected") {
				this.__untoggle = true;
			}
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
		if (this.__untoggle) {
			this.__untoggle = undefined;
			if (this.state !== "disabled") {
				this.clickhandler(ev);
				this.state = "normal";
			}
		} else if (this.state === "active") {
			this.state = "selected";
		}
	};

	this.render = function() {
		var views = [];

		if (this.icon) {
			views.push(this.buttonicon({icon:this.icon}))
		}

		if (this.image) {
			views.push(this.buttonimage({bgimage:this.image}))
		}

		if (this.label) {
			views.push(this.buttonlabel())
		}

		return views;
	};

	define.class(this, "buttonlabel", label, function(){
		this.drawtarget = "color";
		this.padding = 5;
		this.bgcolor = NaN;
		this.fgcolor = wire('this.parent.fgcolor');
		this.text = wire('this.parent.label');
		this.font = wire('this.parent.font');
		this.fontsize = wire('this.parent.fontsize');
		this.bold = wire('this.parent.bold');
		this.boldness = wire('this.parent.boldness');
	});

	define.class(this, "buttonimage", view, function(){
		this.drawtarget = "color";
		this.padding = 5;
		this.bgcolor = NaN;
	});

	define.class(this, "buttonicon", icon, function(){
		this.drawtarget = "color";
		this.padding = 5;
		this.bgcolor = NaN;
		this.fgcolor = wire('this.parent.fgcolor');
		this.fontsize = wire('this.parent.fontsize');
		this.boldness = wire('this.parent.boldness');
	});

});
