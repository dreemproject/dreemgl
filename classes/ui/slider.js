/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class("$ui/view", function($ui$, view, icon) {
// Slider with customizable handle.  To customize the handle put views as the slider's constructor children.  Some working
// example code can be found in the [examples](http://localhost:2000/examples/slider).

	this.attributes = {

		// The color for the value bar in the slider
		fgcolor:Config({type:vec4, value:"black", meta:"color"}),

		// The current value, between 0.0 ~ 1.0
		value:Config({value:0.5, persist:true}),

		// Minimum value allowed, for restricting slider range
		minvalue:Config({value:0.0}),

		// Maximum value allowed, for restricting slider range
		maxvalue:Config({value:1.0}),

		// Horizontal or vertical arrangement
		horizontal:true,

		// Threshold at which to draw a handle if none oare provided in the constructor.
		minhandlethreshold:10.0,

		// Smoothly mix the background/foreground color or draw a hard edge
		smooth:true
	};

	this.height = 5;
	this.alignitems = "center";
	this.justifycontent = "center";

	this.bgcolorfn = function(pos) {
		var axis = pos.x;
		if (!horizontal) {
			axis = pos.y;
		}
		var inrange = (axis > minvalue && axis < value && axis < maxvalue);
		if (inrange) {
			return smooth ? mix(bgcolor, fgcolor, value * axis) : fgcolor;
		}

		return bgcolor;
	};

	this.pointermove = this.pointerend = function(ev) {
		var pos = this.globalToLocal(ev.position);
		var value;
		if (this.horizontal) {
			value = pos.x / this.width;
		} else {
			value = pos.y / this.height;
		}
		this.value = Math.max(this.minvalue, Math.min(this.maxvalue, value));
	};

	this.onvalue = function(ev,v,o) {
		var value = Math.max(this.minvalue, Math.min(this.maxvalue, v));
		if (value != this.value) {
			this.value = value;
		} else {
			this.onsize(null,this.size,this);
		}
	};

	this.render = function() {
		var views = [];

		var cchildren = this.constructor_children;

		if (!cchildren.length
			&& ((this.horizontal && this.height <= this.minhandlethreshold)
			|| (!this.horizontal && this.width <= this.minhandlethreshold))) {
			cchildren = [this.handle()]
		}

		for (var i=0;i<cchildren.length;i++) {
			var child = cchildren[i];
			child.position = "absolute";
			if (this.horizontal) {
				child.x = this.width * this.value - child.width * 0.5;
				child.y = this.height * 0.5 - child.height * 0.5;
			} else {
				child.y = this.height * this.value - child.height * 0.5;
				child.x = this.width * 0.5 - child.width * 0.5;
			}
			views.push(child);
		}
		return views;
	};

	define.class(this, "handle", view, function() {
		this.bgcolor = vec4(1,1,1,0.51);
		this.height = this.width = 26;
		this.borderradius = (this.height * 0.5) - 0.5;
	});

	var slider = this.constructor;
	this.constructor.examples = {

		Usage: function() {
			return [
				slider({x:30, y:30,width:150, bgcolor:"white", fgcolor:"red", value:0.9})
			]
		},

		CustomHandle: function() {
			return [
				slider({x:10, y:30,width:250, bgcolor:"white",smooth:false}, view({bgcolor:'purple', width:40, height:40, fontsize:20}))
			]
		}

	}


});
