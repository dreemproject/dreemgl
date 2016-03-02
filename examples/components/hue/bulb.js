/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$ui/button", function() {

	this.icon = "lightbulb";
	this.flex = 1;
	this.fontsize = 300;
	this.pickalpha = -1;
	this.buttoncolor1 = "transparent";
	this.buttoncolor2 = "transparent";
	this.hovercolor1 = "transparent";
	this.hovercolor2 = "transparent";
	this.pressedcolor1 = "transparent";
	this.pressedcolor2 = "transparent";
	this.borderwidth = 0;
	this.alignself = "center";


	this.attributes = {
		rgb:Config({type:vec3, meta:"color"}),
		alert:Config({type:String}),
		colormode:Config({type:String}),
		effect:Config({type:String}),
		id:Config({type:String}),
		uniqueid:Config({type:String}),
		type:Config({type:String}),
		swversion:Config({type:String}),
		modelid:Config({type:String}),
		manufacturername:Config({type:String}),
		xy:Config({type:vec2}),
		sat:Config({type:int}),
		ct:Config({type:int}),
		hue:Config({type:int}),
		bri:Config({type:int}),
		on:Config({type:Boolean}),
		reachable:Config({type:Boolean})
	};


	this.init = this.onon = this.onbri = this.onrgb = this.reset = function() {
		if (this.rgb && this.bri) {
			if (this.on === true) {
				this.textcolor = vec4(this.rgb[0] / 255.0, this.rgb[1] / 255.0, this.rgb[2] / 255.0, this.bri / 255.0);
				this.textactivecolor = vec4(this.rgb[0] / 255.0, this.rgb[1] / 255.0, this.rgb[2] / 255.0, 1)
			} else {
				this.textcolor = "black";
				this.textactivecolor = vec4(this.rgb[0] / 255.0, this.rgb[1] / 255.0, this.rgb[2] / 255.0, 0.3)
			}
		}
	};

});
