/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require, $ui$, button, screen, label, view, icon, cadgrid) {

		this.render = function() {
			return [
				screen(
					cadgrid({
							name:"grid",
							bgcolor:"#4e4e4e",
							gridsize:8,
							majorevery:5,
							majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1),
							minorline:vec4(0.2823529541492462,0.2823529541492462,0.2823529541492462,1),
							alignself:'stretch',
							flexdirection:'row',
							alignitems:"center",
							justifycontent:'space-around'
						},
						view({ flex:0, flexdirection:"column" },
							label({
								name:"status",
								marginbottom:20,
								text:"Basic Usage"
							}),
							button({
								text:"Click Button",
								click:function(ev,v,o){
									this.screen.find("status").text = "Button clicked!";
								}})
						),
						view({ flex:0, flexdirection:"column" },
							label({text:"Using Background Images"}),
							button({
								text:"Click To Change",
								padding:40,
								bgimagemode:"stretch",
								toggle:false,
								bgimage:"$resources/textures/redcloud.png",
								stateclick:function() {
									if (this.toggle) {
										this.textcolor = this.textactivecolor = "white";
										this.bgimage = "$resources/textures/redcloud.png";
									} else {
										this.textcolor = this.textactivecolor = "black";
										this.bgimage = "$resources/textures/bluecloud.png";
									}
									this.toggle = !this.toggle;
								}
							})
						)
					)
				)
			]
		}
	}
)
