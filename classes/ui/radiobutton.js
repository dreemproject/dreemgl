/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/


define.class('$ui/button', function(exports, $ui$, icon, label) {

	exports.groups = {}
	exports.select = function(group, value) {
		var current = this.groups[group];
		if (current) {
			current.selected = false;
			current.textcolor = "white"
		}

		this.groups[group] = value;
		value.selected = true;
	};

	this.attributes = {
		group:"default",
		selected:false,
		// Color of the label text in pressed-down state
		textselectedcolor: Config({meta:"color", type: vec4, value: vec4("yellow")}),

		// First gradient color for the button background in selected state
		selectedcolor1: Config({meta:"color", type: vec4, value: vec4("#888")}),

		// Second gradient color for the button background in selected state
		selectedcolor2: Config({meta:"color", type: vec4, value: vec4("#AAA")})
	}

	this.buildIconRes = function() {
		return icon({
			drawtarget:"color",
			fgcolor:this.selected ? this.textselectedcolor : this.textcolor,
			fontsize: this.fontsize,
			icon: this.icon
		})
	};

	this.buildButtonRes = function(iconres) {
		return label({
			drawtarget:"color",
			marginleft:iconres ? this.iconmargin : 0,
			fontsize: this.fontsize,
			fgcolor:this.selected ? this.textselectedcolor : this.textcolor,
			text: this.text
		})
	};

	this.init = function() {
		if (this.selected) {
			this.constructor.select(this.group, this)
		}
	}

	this.onselected = function() {
		this.statenormal()
	}

	// the hover state when someone hovers over the button
	this.statehover = function(){
		this.shadowopacity = 1.0;
		this.col1 = this.hovercolor1;
		this.col2 = this.hovercolor2;
		this.setTextColor(this.selected ? this.textselectedcolor : this.textactivecolor)
	}

	// the normal button state
	this.statenormal = function(first) {
		this.shadowopacity = 0.0;
		this.col1 = Mark(this.selected ? this.selectedcolor1 : this.buttoncolor1, first);
		this.col2 = Mark(this.selected ? this.selectedcolor2 : this.buttoncolor2, first);
		this.setTextColor(this.selected ? this.textselectedcolor : this.textcolor)
	}

	this.click = function() {
		this.constructor.select(this.group, this)
	}

});
