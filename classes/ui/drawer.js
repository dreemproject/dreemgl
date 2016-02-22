/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class("$ui/view", function(require, $ui$, view){
// A drawer view that slides to reveal trays either to the left and right in horizontal mode or or the top and
// bottom in vertical mode.  Subviews can contain components which will become activated as the lower tray is revealed.
// Up to three subviews can be added to the drawer's constructor, providing the top drawer view, the right tray view
// and the left tray view, in that order.

	this.tooldragroot = true;
	this.overflow = "hidden";
	this.bgcolor = "transparent";
	this.pickalpha = -1;

	this.attributes = {

		// The orientation of the drawers, ether left/right or top/bottom
		direction:Config({type:Enum("horizontal", "vertical"), value:"horizontal"}),

		// The relative offset of the top drawer view to the center, a value between (far left) -1.0 ~ 1.0 (far right),
		// with 0 being exactly at the center.
		value:Config({value:0.0, persist:true}),

		// The threshold value at which to allow the drawer to open and lock the right tray
		min:-0.5,

		// The threshold value at which to allow the drawer to open and lock the left tray
		max:0.5
	};

	this.onvalue = function(ev,v,o) {
		if (this._main) {
			this._main.x = this.direction === "horizontal" ? v * this.width : 0;
			this._main.y = this.direction === "vertical" ? v * this.height : 0;
		}

		this._left.visible = v > 0;

		if (this._left) {
			this._left.drawtarget = v === this.max ? "both" : "color"
		}
		if (this._right) {
			this._right.drawtarget = v === this.min ? "both" : "color"
		}

	};

	this.pointermove = function(p, loc, v) {
		var main = this._main;

		// FIXME(mason) this is for the demo, and is a lame way to do it.  Needs to be cancellable pointer event maybe?
		if (this.ignoremove === true) {
			this.value = this._value;
			return;
		}

		var value = 0;

		if (this.direction === "vertical") {
			var newy = main.y + p.movement.y;
			newy = Math.min(Math.max(newy, 0 - main.height), this.height);
			value = newy / this.height;
		} else {
			var newx = main.x + p.movement.x;
			newx = Math.min(Math.max(newx, 0 - main.width), this.width);
			value = newx / this.width;
		}

		if ((!this.leftview && value > 0) || (!this.rightview && value < 0)) {
			value = 0;
		}

		if (value !== this.value) {
			this.value = value;
		}
    };

	this.pointerend = function(p, loc, v) {

		// FIXME(mason) see above
		if (this.ignoremove === true) {
			this.ignoremove = undefined;
			return;
		}

		var value = this.value;

		if (value < this.min) {
			value = this.min
		} else if (value > this.max) {
			value = this.max
		} else {
			value = 0;
		}

		if ((!this.leftview && value > 0) || (!this.rightview && value < 0)) {
			value = 0;
		}

		if (value !== this.value) {
			this.value = value;
		}
	};

	this.init = function() {
		this.mainview = this.constructor_children[0];
		this.rightview = this.constructor_children[1];
		this.leftview = this.constructor_children[2];
	};

	this.render = function() {
		var views = [];

		if (this.rightview) {
			views.push(this._right = view({
				drawtarget:"color",
				position:"absolute",
				alignitems:"stretch",
				justifycontent:"center",
				width:this.width,
				height:this.height
			}, this.rightview));
		}

		if (this.leftview) {
			views.push(this._left = view({
				drawtarget:"color",
				position:"absolute",
				alignitems:"stretch",
				justifycontent:"center",
				width:this.width,
				height:this.height,
				visible:false
			},this.leftview));
		}

		views.push(this._main = view({
			drawtarget:"color",
			position:"absolute",
			alignitems:"stretch",
			justifycontent:"center",
			width:this.width,
			height:this.height
		}, this.mainview));

		return views;
	};

	// Basic usage of the drawer.
	var drawer = this.constructor;
	this.constructor.examples = {
		Usage:function(){
			var label = require("$ui/label");
			return [
				drawer({
					x:50,y:50,
					height:70, width:200
				},
					view({flex:1,bgcolor:"red",justifycontent:"center",alignitems:"center"}, label({text:"<< Slide Me >>"})),
					view({flex:1,bgcolor:"green",justifycontent:"flex-end",alignitems:"center"}, label({text:"I'm the right"})),
					view({flex:1,bgcolor:"blue",alignitems:"center"}, label({text:"I'm the left"})))
			]
		}
	}


});
