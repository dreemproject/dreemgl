/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition", function (require, $server$, service, $ui$, icon, slider, button, checkbox, label, screen, view, cadgrid, $widgets$, colorpicker) {

		function componentToHex(c) {
			c = Math.floor(c);
			var hex = c.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		}

		function rgbToHex(r, g, b) {
			return "#" + componentToHex(r * 255) + componentToHex(g * 255) + componentToHex(b * 255);
		}

		function hexToRgb(hex) {
			hex += '';
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			    return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? vec4(
				parseInt(result[1], 16) / 255,
				parseInt(result[2], 16) / 255,
				parseInt(result[3], 16) / 255
			) : null;
		}

		this.render = function () {
			return [
				service({
					name:"iot",
					things: {},
					update: function(thingid, state, value) {
						if (! thingid) {
							// set all
							this.__things.set(':' + state, value);
						} else {
							for (var i = 0; i < this.__things.length; i++) {
								var candidate = this.__things[i];
								// console.log('candidate', candidate)
								var meta = candidate.state('meta');
								var id = meta['iot:thing-id'];
								if (id === thingid) {
									// found the thing, set its state
									candidate.set(':' + state, value);
									// console.log('found id', thingid, state, value)
								}
							}
						}
					},
					__updateModel: function(thing) {
						var id = thing.thing_id();
						var meta = thing.state("meta");
						var facets = meta['iot:facet'];
						if (facets && facets.map) {
							facets = facets.map(function(facet) {
								return facet.split(':')[1]
							})
						}
						// console.log('thing metadata', id, meta, facets)

						// copy over fields
						this.things[id] = {
							state: thing.state("istate"),
							id: meta['iot:thing-id'],
							name: meta['schema:name'],
							reachable: meta['iot:reachable'],
							manufacturer: meta['schema:manufacturer'],
							model: meta['schema:model'] || meta['iot:model-id'],
							facets: facets,
							type: meta['iot:vendor.type']
						};

						// shouldn't this be enough to update the attribute in the browser over RPC?
						this.things = JSON.parse(JSON.stringify(this.things))
						// console.log("updated state\n", this.things);
					},
					init: function() {
						var iotdb = require("iotdb");

						this.__things = iotdb.connect('HueLight', {poll: 1}).connect();
						// console.log('THINGS: ', this.__things);

						// listen for new things
						this.__things.on("thing", function(thing) {
							// console.log('new THING: ', thing)
							this.__updateModel(thing);
							// register for changes to each thing
							thing.on("istate", function(thing_inner) {
								// console.log('new state on THING: ', thing)
								// update to reflect changes
								this.__updateModel(thing_inner);
							}.bind(this));
						}.bind(this));
					}
				}),
				screen(
					view({
						name:"main",
						flexdirection: "row",
						alignitems: "center",
						things: Config({type:Array, value:wire('this.rpc.iot.things')}),
						onthings: function(things) {
							// console.log('onthings', things);
						},
						render: function() {
							// why is this.things 0? Why don't I render when things changes?
							// console.log("Things:", this.things)

							var lights = [];

							var keys = Object.keys(this.things).sort();

							for (var i = 0; i < keys.length; i++) {
								var key = keys[i];
								// console.log('key', key, this.things[key])
								(function(key) {
									var thing = this.things[key];
									var id = thing.id;
									var type = thing.facets[thing.facets.length - 1];

									// don't show these...
									delete thing.state['@timestamp']

									lights.push(
										label({
											text: thing.name + ' ' + type + ' ' + JSON.stringify(thing.state)
										})
									)

									if ('on' in thing.state) {
										lights.push(
											button({
												text:"on",
												click:function() {
													this.rpc.iot.update(id, 'on', true)
												}.bind(this)
											})
										)

										lights.push(
											button({
												text:"off",
												click:function() {
													this.rpc.iot.update(id, 'on', false)
												}.bind(this)
											})
										)
									}

									// if ('color' in thing.state) {
									// 	lights.push(
									// 		colorpicker({
									// 			value: vec4(hexToRgb(thing.state.color)),
									// 			valuechange:function(color) {
									// 				var hex = rgbToHex(color[0], color[1], color[2]);
									// 				this.rpc.iot.update(id, 'color', hex);
									// 			}.bind(this)
									// 		})
									// 	)
									// }
								}.bind(this))(key);
							}

							lights.push(
								button({
									text:"all on",
									click:function() {
										this.rpc.iot.update(null, 'on', true)
									}.bind(this)
								})
							);

							lights.push(
								button({
									text:"all off",
									click:function() {
										this.rpc.iot.update(null, 'on', false)
									}.bind(this)
								})
							);

							lights.push(
								button({
									text:"rerender",
									click:function() {
										this.render();
									}.bind(this)
								})
							);

							return lights;
						}
					})
				)
			]
		}
	}
)
