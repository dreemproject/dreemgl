/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$system/base/node", function() {
// 	Provides information about the distance of a nearby physical object using the proximity sensor of a device.

	this.name = "proximity";

	this.attributes = {
		// True if proximity is supported
		supported:Config({type:Boolean, value:false}),

		// The maximum sensing distance the sensor is able to report, in centimeters
		max:Config({type:Number, value:0}),

		// The minimum sensing distance the sensor is able to report, in centimeters. Ususally zero.
		min:Config({type:Number, value:0}),

		// The current device proximity, in centimeters
		distance:Config({type:Number, value:0})
	};

	this.init = function() {
		// TODO: use lzidle to throttle
		window.addEventListener('deviceproximity', function(ev) {
			if (!this._supported) {
				this.supported = true;
			}
			this.min = ev.min;
			this.max = ev.max;
			this.distance = ev.value;
		}.bind(this));
	};

	var proximity = this.constructor;
	this.constructor.examples = {
		Usage: function() {
			return [
				proximity()
			]
		}
	}
});
