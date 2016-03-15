/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$system/base/node", function(require) {
// 	The gyro receives gyroscope and compass data where available.
// See [deviceorientation](https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation) and [DeviceOrientationEvent](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
// <br/><a href="/examples/sensors">example &raquo;</a>
	
	this.name = "gyroscope";

	this.attributes = {
		// True if gyro is supported
		supported:Config({type:Boolean, value:false}),

		// Three component (alpha, beta, gamma) orientation of the device
		orientation:Config({type:vec3, value:vec3(0,0,0)}),

		// Alias for the alpha component of orientation
		alpha: Config({alias:'orientation', index:0}),

		// Alias for the beta component of orientation
		beta: Config({alias:'orientation', index:1}),

		// Alias for the gamma component of orientation
		gamma: Config({alias:'orientation', index:2}),

		// The compass orientation, see [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
		compass:Config({type:Number, value:0}),

		// The compass accuracy, see [https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html](https://developer.apple.com/library/safari/documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html) for details.
		accuracy:Config({type:Number, value:0})
	};

	this.init = function() {
		// TODO: use lzidle to throttle
		window.addEventListener('deviceorientation', function(ev) {
			var orientationevents = ['alpha', 'beta', 'gamma'];
			for (var i = 0; i < orientationevents.length;i++) {
				var name = orientationevents[i];
				var value = ev[name];
				if (typeof(value) !== "undefined") {
					if (!this._supported) {
						this.supported = true;
					}
					this[name] = value;
				}
			}

			this.accuracy = ev.webkitCompassAccuracy;
			this.compass = ev.webkitCompassHeading;
		}.bind(this));
	};

	var gyroscope = this.constructor;
	this.constructor.examples = {
		Usage: function() {
			var label = require("$ui/label");
			return [
				gyroscope({
					onorientation:function(ev,v,o) {
						o.find("gyro").text = "Current gyro value is a:" + v[0] +", b:" + v[1] + ", g:" + v[2]
					}
				}),
				label({name:"gyro", text:"Searching for gyroscope ..."})
			]
		}
	}
});
