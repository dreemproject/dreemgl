/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$system/base/node", function(require) {
// 	The light sensor receives ambient light data where available.

	this.name = "ambient";

	this.attributes = {
		// True if ambient light sensor is supported
		supported:Config({type:Boolean, value:false}),

		// Sensed value of ambient light
		luminosity:Config({type:Number, value:0})
	};

	this.init = function() {
		// TODO: use lzidle to throttle
		window.addEventListener('devicelight', function(ev) {
			if (!this._supported) {
				this.supported = true;
			}
			this.luminosity = ev.value;
		}.bind(this));
	};

	var light = this.constructor;
	this.constructor.examples = {
		Usage: function() {
			var label = require("$ui/label");

			return [
				light({
					onluminosity:function(ev,v,o) {
					    o.find("lux").text = "Current luminosity is: " + v;
					}
				}),
				label({name:"lux", text:"Searching for ambient light sensor ..."})
			]
		}
	}
});
