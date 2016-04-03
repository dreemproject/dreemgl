/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition", function (require, $ui$, icon, slider, button, checkbox, label, screen, view, cadgrid, $widgets$, colorpicker, $$, iot) {


function componentToHex(c) {
		c = Math.floor(c);
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r * 255) + componentToHex(g * 255) + componentToHex(b * 255);
}

		this.render = function () {

			return [
				iot({
					name:"iot"
				}),
				screen(
					view({
						name:"main",
						flexdirection: "row",
						alignitems: "center",
						things: wire('this.rpc.iot.things'),
						onthings: function(things) {
							console.log('onthings', things);
						},
						render: function() {
							// why is this.things 0? Why don't I render when things changes?
							var things = this.rpc.iot.things;

							console.log("Things:", this.things, things)

							var lights = [];
							lights.push(
								button({
									text:"rerender",
									click:function() {
										this.render();
									}.bind(this)
								})
							);

							lights.push(
								button({
									text:"on",
									click:function() {
										this.rpc.iot.update(things[2].id, 'on', true)
									}.bind(this)
								})
							)


							lights.push(
								button({
									text:"off",
									click:function() {
										this.rpc.iot.update(things[2].id, 'on', false)
									}.bind(this)
								})
							)

							lights.push(
								colorpicker({
									valuechange:function(color) {
										var hex = rgbToHex(color[0], color[1], color[2]);
										this.rpc.iot.update(things[2].id, 'color', hex);
									}
								})
							)

							return lights;
						}
					})
				)
			]
		}
	}
)
