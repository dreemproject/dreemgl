/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$system/base/node", function(require) {
// 	The accelerometer receives acceleration data where available.
// <br/><a href="/examples/sensors">example &raquo;</a>

	this.name = "accelerometer";

	this.attributes = {
		// True if accelerometer is supported
		supported:Config({type:Boolean, value:false}),

		// Three component (x, y, z) instant acceleration of the device
		acceleration:Config({type:vec3, value:vec3(0,0,0)}),

		// Alias for the x component of acceleration
		x: Config({alias:'acceleration', index:0}),

		// Alias for the y component of acceleration
		y: Config({alias:'acceleration', index:1}),

		// Alias for the z component of acceleration
		z: Config({alias:'acceleration', index:2})

	};

	this.init = function() {
		// TODO: use lzidle to throttle
		window.addEventListener('devicemotion', function(ev) {
			var accel = ev.accelerationIncludingGravity
			if (accel) {
				for (var key in accel) {
					if (accel.hasOwnProperty(key)) {
						var value = ev.accelerationIncludingGravity[key]
						if (typeof(value) !== "undefined") {
							if (!this._supported) {
								this.supported = true;
							}
							this[key] = value
						}
					}
				}
			}
		}.bind(this));
	};

	var accelerometer = this.constructor;
	this.constructor.examples = {
		Usage: function() {
			var label = require("$ui/label");

			return [
				accelerometer({
					onacceleration:function(ev,v,o) {
						o.find("accel").text = "Current acceleration is x:" + v[0] +", y:" + v[1] + ", z:" + v[2]
					}
				}),
				label({name:"accel", text:"Searching for accelerometer ..."})
			]
		}
	}
});
