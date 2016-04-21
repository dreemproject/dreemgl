/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
   Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class("$ui/view", function(require, $ui$, view){
// A drawer view that slides to reveal trays either to the left and right in horizontal mode or or the top and
// bottom in vertical mode.  Subviews can contain components which will become activated as the lower tray is revealed.
// Up to three subviews can be added to the drawer's constructor, providing the top drawer view, the right tray view
// and the left tray view, in that order.
// <br/><a href="/examples/drawers">examples &raquo;</a>


	this.tooldragroot = true;
	this.overflow = "hidden";
	this.bgcolor = "transparent";
	this.pickalpha = -1;

	this.attributes = {

		// The orientation of the drawers, ether left/right or top/bottom
		direction:Config({type:Enum("horizontal", "vertical"), value:"horizontal"}),

		// The relative offset of the top drawer view to the center, a value between (far left) -1.0 ~ 1.0 (far right),
		// with 0 being exactly at the center.
		value:Config({value:0.0, persist:false}),

		// The threshold value at which to allow the drawer to open and lock the right tray
		min:-0.5,

		// The threshold value at which to allow the drawer to open and lock the left tray
		max:0.5,

		// The reference value whether refer to current position or absolute position
		referAbs: false,
		refabs: { x: 0, y: 0 },
	};

	this.mainvalue = function(value) {
		return value;
	}

	this.onvalue = function(ev,v,o) {

		if (this._main) {
			this._main.x = this.direction === "horizontal" ? this.mainvalue(v) * this.width : 0;
			this._main.y = this.direction === "vertical" ? this.mainvalue(v) * this.height : 0;
		}

		if (v > 0) {
			this._left.visible = true;
			this._right.visible = !this._left.visible;
			this._left.x = 0;
			this._left.y = 0;
		} else {
			this._left.visible = false;
			this._right.visible = !this._left.visible;
			this._right.x = 0;
			this._right.y = 0;
		}

		if (this._left) {
			this._left.drawtarget = v === this.max ? "both" : "color"
		}
		if (this._right) {
			this._right.drawtarget = v === this.min ? "both" : "color"
		}

	};

	this.pointermove = function(p, loc, v) {
		var main = this._main;

		var value = 0;

		// cumulative damped movement value.
		// Used to decide if enough horizontal/vertical movement is present.
		this.dampedmovement = this.dampedmovement || vec2(0, 0)
		this.dampedmovement = vec2(
			(this.dampedmovement[0] * 9 + p.movement[0]) / 10,
			(this.dampedmovement[1] * 9 + p.movement[1]) / 10
		)

		if(this.referAbs) {
			if (this.direction === "vertical") {
				if (abs(this.dampedmovement[0]) > abs(this.dampedmovement[1]) * 2) return
				this.refabs.y += p.movement.y
				var newy = this.refabs.y;
				newy = Math.min(Math.max(newy, 0 - main.height), this.height);
				value = newy / this.height;
			} else {
				if (abs(this.dampedmovement[1]) > abs(this.dampedmovement[0]) / 2) return
				this.refabs.x += p.movement.x
				var newx = this.refabs.x;
				newx = Math.min(Math.max(newx, 0 - main.width), this.width);
				value = newx / this.width;
			}
		}
		else {
			if (this.direction === "vertical") {
				if (abs(this.dampedmovement[0]) > abs(this.dampedmovement[1]) * 2) return
				var newy = main.y + p.movement.y;
				newy = Math.min(Math.max(newy, 0 - main.height), this.height);
				value = newy / this.height;
			} else {
				if (abs(this.dampedmovement[1]) > abs(this.dampedmovement[0]) / 2) return
				var newx = main.x + p.movement.x;
				newx = Math.min(Math.max(newx, 0 - main.width), this.width);
				value = newx / this.width;
			}
		}

		if ((!this.leftview && value > 0) || (!this.rightview && value < 0)) {
			value = 0;
		}

		if (value !== this.value) {
			this.value = value;
		}
	};

	this.pointerend = function(p, loc, v) {

		var value = this.value;

		if (value <= this.min) {
			if(this.referAbs) {
				if (this.direction === "vertical") this.refabs.y = this.min*this.height
				else this.refabs.x = this.min*this.width
			}
			value = this.min
		} else if (value >= this.max) {
			if(this.referAbs) {
				if (this.direction === "vertical") this.refabs.y = this.max*this.height
				else this.refabs.x = this.max*this.width
			}
			value = this.max
		} else {
			if(this.referAbs) this.refabs = { x: 0, y: 0 }
			value = 0;
		}


		if ((!this.leftview && value > 0) || (!this.rightview && value < 0)) {
			value = 0;
		}

		if (value !== this.value) {
			this.value = this.endvalue(value)
		}

	};

	this.endvalue = function(value) {
		return value;
	}

	this.init = function() {
		this.mainview = this.constructor_children[0];
		this.rightview = this.constructor_children[1];
		this.leftview = this.constructor_children[2];
		this.onvalue(null, this._value, this)
	};

	this.render = function() {
		var views = [];

		var x = this.direction === "horizontal" ? this._value * (this.width || this._layout.width) : 0;
		var y = this.direction === "vertical" ? this._value * (this.height || this._layout.height) : 0;

		var leftvisible = true;
		if (this._value < 0) {
			leftvisible = false;
		}

		if (this.rightview) {
			views.push(this._right = view({
				drawtarget:"color",
				position:"absolute",
				alignitems:"stretch",
				justifycontent:"center",
				x:0,
				y:0,
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
				x:0,
				y:0,
				visible:leftvisible,
				width:this.width,
				height:this.height
			},this.leftview));
		}

		views.push(this._main = view({
			drawtarget:"color",
			position:"absolute",
			alignitems:"stretch",
			justifycontent:"center",
			x:x,
			y:y,
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
