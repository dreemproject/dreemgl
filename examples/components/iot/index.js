/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition", function (require, $ui$, icon, slider, button, checkbox, label, screen, view, cadgrid, $widgets$, colorpicker, $$, iot) {

		this.render = function () {

			return [
				iot({
					name:"iot"
				}),
				screen({
					name:"desktop",
					clearcolor: '#888'
				},
					cadgrid({
						name:"main",
						bgcolor: vec4(0.07999999821186066, 0.10000000149011612, 0.10000000149011612, 1),
						toolselect: false,
						toolmove: false,
						gridsize: 5,
						majorevery: 10,
						majorline: vec4(0, 0.20000000298023224, 0.30000001192092896, 1),
						minorline: vec4(0, 0.19792191684246063, 0.17214606702327728, 1),
						flexdirection: "row",
						justifycontent: "space-around",
						alignitems: "center",
						render:function() {
							var lights = [];

							var things = this.rpc.iot.things;

							console.log("Base has lights:", things)

							for (var uid in things) {
								console('thing', things[uid])
							}

							lights.push(view({
								visible:this.rpc.iot.linkalert,
								position:"absolute",
								x:200,
								y:100,
								width:300,
								height:300,
								borderradius:30,
								bgcolor:"white",
								flexdirection:"column",
								justifycontent:"center",
								alignitems:"center"
							},
								view({alignitems:"center"},icon({fontsize:40, marginright:20, fgcolor:"cornflowerblue", icon:"link"}),label({fontsize:30, fgcolor:"#888", text:"Missing Link!"})),
								label({
									padding:20,
									marginleft:20,
									fgcolor:"#888",
						    		text:"Press the Link button on top\nof your base station and then\n quickly press this button:"
								}),
								button({
									text:"Link To Basestation",
									click:function() {
										this.rpc.iot.linkalert = false;
										this.rerender();
									}.bind(this)
								}))
							);

							return lights;
						}
					}))
			]
		}
	}
)
