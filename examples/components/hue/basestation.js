/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/service", function() {

	this.name = "basestation";

	this.attributes = {
		ipaddress:Config({type:String, persist:true}),
		username:Config({type:String, persist:true}),
		lights:Config({type:Object, persist:true}),
		light:Config({type:Event}),
		api:Config({type:Object, persist:true}),
		linkalert:Config({type:Boolean, value:false, persist:true})
	};

	this.failure = function(err) { console.log("[ERROR]", err); }

	this.setLightState = function(id, state) {
		if (!this.api) {
			this.buildapi();
		} else {
			if (!this.__lock) {
				this.__lock = true;
				setTimeout(function(){
					this.api
						.setLightState(id, state)
						.then(function(result) { this.refresh(); }.bind(this))
						.fail(this.failure)
						.done();
					this.__lock = false;
				}.bind(this), 100)
			}

		}
	};

	this.onlinkalert = function(ev,v,o) {
		if (v === false && !this.username) {
			this.register();
		}
	};

	this.register = function() {
		if (!this.HueApi) {
			return;
		}

		var hue = new this.HueApi();

		console.log("Attempting to register...")

		hue.registerUser(this.ipaddress, "DreemGL Hue Bridge")
			.then(function (result) {
				this.username = result;
				console.log("got username!", this.username)
			}.bind(this))
			.fail(function (err) {
				if (err.message === "link button not pressed") {
					this.linkalert = true;
				}
			}.bind(this))
			.done();

	};

	this.onusername = this.onipaddress = this.buildapi = function() {
		if (!this.HueApi) {
			return;
		}

		if (this.ipaddress) {
			if (this.username) {
				console.log("Create api for ", this.ipaddress, this.username)
				this.api = new this.HueApi(this.ipaddress, this.username);
			} else {
				this.register();
			}
		} else {
			this.search();
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
		if (!this.api) {
			return;
		}

		console.log("Seeking lights");

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
					console.log("Found lights", this.lights)
				}
			}.bind(this))
			.fail(this.failure)
			.done();
	};

	this.search = function() {

		if (!this.Hue) {
			return;
		}

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

		if (this.Hue) {
			this.HueApi = this.Hue.HueApi;
			this.search();

		}

	}

});
