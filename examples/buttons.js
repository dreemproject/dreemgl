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
							label({
								marginbottom:20,
								text:"Text Alignment"
							}),
							view({margintop:10},
								button({width:150, height:100, padding:10,
									text:"Top Left", alignitems:"flex-start", justifycontent:"flex-start"}),
								button({marginleft:10, width:150, height:100, padding:10,
									text:"Top Center", alignitems:"flex-start", justifycontent:"center"}),
								button({marginleft:10, width:150, height:100, padding:10,
									text:"Top Right", alignitems:"flex-start", justifycontent:"flex-end"})
							),
							view({margintop:10},
								button({width:150, height:100, padding:10,
									text:"Left", justifycontent:"flex-start"}),
								button({marginleft:10, width:150, height:100,
									text:"Center"}),
								button({marginleft:10, width:150, height:100, padding:10,
									text:"Right", justifycontent:"flex-end"})
							),
							view({margintop:10},
								button({width:150, height:100, padding:10,
									text:"Bottom Left", alignitems:"flex-end", justifycontent:"flex-start"}),
								button({marginleft:10, width:150, height:100, padding:10,
									text:"Bottom Center", alignitems:"flex-end", justifycontent:"center"}),
								button({marginleft:10, width:150, height:100, padding:10,
									text:"Bottom Right", alignitems:"flex-end", justifycontent:"flex-end"})
							)
						),
						view({ flex:0, flexdirection:"column" },
							label({text:"Background Images", marginbottom:20}),
							button({
								padding:40,
								text:"Click To Change",
								textcolor:"white",
								textactivecolor:"#666",
								bgimage:"$resources/textures/redcloud.png",
								bgimagemode:"stretch",

								selected:false,

								click:function() { this.selected = !this.selected; },

								statenormal:function() {
									if (this.selected) {
										this.bgimage = "$resources/textures/bluecloud.png";
										this.setTextColor(this.textactivecolor)
									} else {
										this.bgimage = "$resources/textures/redcloud.png";
										this.setTextColor(this.textcolor)
									}
								},
								statehover:function() {
									if (!this.selected) {
										this.bgimage = "$resources/textures/greencloud.png";
										this.setTextColor(this.textactivecolor)
									}
								},
								stateclick:function() {
									this.bgimage = "$resources/textures/purplecloud.png";
									this.setTextColor(this.textcolor)
								},
								onselected:function() { this.statenormal() }
							})
						)
					)
				)
			]
		}
	}
)
