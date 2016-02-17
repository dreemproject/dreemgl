/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// Sprite class

define.class("$ui/view", function($ui$, view){
// A view that slides left or right to reveal a subview

	this.tooldragroot = true;
	this.overflow = "hidden";

	this.attributes = {

		direction:Config({type:Enum("horizontal", "vertical"), value:"horizontal"}),

		// The current value, between 0.0 ~ 1.0
		value:Config({value:0.0, persist:true}),

		min:-0.7,
		max:0.5
	};

	this.onvalue = function(ev,v,o) {
		if (this._main) {
			this._main.x = this.direction === "horizontal" ? v * this.width : 0;
			this._main.y = this.direction === "vertical" ? v * this.height : 0;
		}

		console.log('v>', v)

		this._left.visible = v > 0;
		this._right.visible = !this._left.visible;
	};

	this.pointermove = function(p, loc, v) {
		var main = this._main;

		if (!main) {
			main = this._main = find("main");
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
		var main = this._main;

		if (!main) {
			main = this._main = find("main");
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

		if (this.leftview) {
			views.push(this._left = view({
				name:"green",
				bgcolor:"green",
				position:"absolute",
				width:this.width,
				height:this.height,
				alignitems:"stretch",
				justifycontent:"center"
			},this.leftview));
		}

		if (this.rightview) {
			views.push(this._right = view({
				name:"red",
				bgcolor:"red",
				position:"absolute",
				width:this.width,
				height:this.height,
				alignitems:"stretch",
				justifycontent:"center"
			}, this.rightview));
		}

		views.push(this._main = view({
			name:"main",
			drawtarget:"color",
			position:"absolute",
			width:this.width,
			height:this.height
		}, this.mainview));

		return views;
	};

});
