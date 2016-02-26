/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/service", function() {

	this.name = "basestation";

	this.attributes = {
		ipaddress:Config({type:String}),
		username:Config({type:String, value:"6ba5c7d32222e31f779722a818296a09"}),
		lights:Config({type:Object}),
		light:Config({type:Event}),
		api:Config({type:Object})
	};

	this.failure = function(err) { console.log("[ERROR]", err); }

	this.setLightState = function(id, state) {
		if (!this.api) {
			this.search();
		} else {
			this.api
				.setLightState(id, state)
				.then(function(result) {
					this.refresh();
				}.bind(this))
				.fail(this.failure)
				.done();
		}
	};

	this.onusername = this.onipaddress = function() {
		if (this.username && this.ipaddress) {
			this.api = new this.HueApi(this.ipaddress, this.username);
		}
	};

	this.updateLight = function(info) {
		if (!info) { return; }

		var light = this.lights[info.uniqueid];

		if (!light) {
			light = this.lights[info.uniqueid] = {}
		}

		for (var prop in info) {
			if (info.hasOwnProperty(prop)) {
				if (prop === "state") {
					var state = info[prop];
					for (var stateprop in state) {
						if (state.hasOwnProperty(stateprop)) {
							light[stateprop] = state[stateprop];
						}
					}
				} else {
					light[prop] = info[prop];
				}
			}
		}

		this.emit("light", {value:light})
	};

	this.onapi = this.refresh = function() {
		this.api
			.lights()
			.then(function(result) {
				if (result && result.lights) {
					var lights = {};
					for (var i=0;i<result.lights.length;i++) {
						var light = result.lights[i];
						lights[light.uniqueid] = light;
						this.api
							.lightStatusWithRGB(light.id)
							.then(this.updateLight.bind(this))
							.fail(this.failure)
							.done();
					}
					this.lights = lights;
				}
			}.bind(this))
			.fail(this.failure)
			.done();
	};

	this.search = function() {
		console.log("Searching for more lights...")
		this.Hue.nupnpSearch(function(err, result) {
			if (err) { console.log("[ERROR]", err) }
			for(var r in result) {
				if (result.hasOwnProperty(r)) {
					var bridge = result[r];
					if (bridge.ipaddress) {
						this.ipaddress = bridge.ipaddress
					}
				}
			}
		}.bind(this));
	};

	this.init = function() {
		this.Hue = require("node-hue-api");
		this.HueApi = this.Hue.HueApi;
		this.search();
	}

});
