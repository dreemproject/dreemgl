/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require, $ui$, checkbox, screen, label, view, icon, cadgrid) {

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
						view({ flexdirection:"column", flex:0 },
							label({text:"Basic Usage", marginbottom:20}),
							checkbox({
								bgcolor:"transparent",
								textcolor:"transparent",
								textactivecolor:"white",
								click:function(){
									this.find("status").text = "Value is: " + this.value
								}
							}),
							label({name:"status", text:"Value is: false", fontsize:12, margintop:5})
						),
						view({ flexdirection:"column", flex:0 },
							checkbox({
								icon:"square-o",
								text:"Checkbox One Unselected (FALSE)",
								borderwidth:0,
								bgcolor:"transparent",
								textcolor:"white",
								textactivecolor:"white",
								click:function(){
									this.icon = this.value ? "check-square-o" : "square-o"
									this.text = "Checkbox One " + (this.value ? "Selected (TRUE)" : "Unselected (FALSE)")
								}
							}),
							checkbox({
								icon:"square-o",
								text:"Checkbox Two Unselected (FALSE)",
								borderwidth:0,
								bgcolor:"transparent",
								textcolor:"white",
								textactivecolor:"white",
								click:function(){
									this.icon = this.value ? "check-square-o" : "square-o"
									this.text = "Checkbox Two " + (this.value ? "Selected (TRUE)" : "Unselected (FALSE)")
								}
							}),
							checkbox({
								value:true,
								icon:"check-square-o",
								text:"Checkbox Three Unseected (TRUE)",
								borderwidth:0,
								bgcolor:"transparent",
								textcolor:"white",
								textactivecolor:"white",
								click:function(){
									this.icon = this.value ? "check-square-o" : "square-o"
									this.text = "Checkbox Three " + (this.value ? "Selected (TRUE)" : "Unselected (FALSE)")
								}
							}),
							checkbox({
								value:true,
								icon:"check-square-o",
								text:"Checkbox Four Unseected (TRUE)",
								borderwidth:0,
								bgcolor:"transparent",
								textcolor:"white",
								textactivecolor:"white",
								click:function(){
									this.icon = this.value ? "check-square-o" : "square-o"
									this.text = "Checkbox Four " + (this.value ? "Selected (TRUE)" : "Unselected (FALSE)")
								}
							})
						),
						view({ flexdirection:"column", flex:0 },
							label({text:"Icon w/ text", marginbottom:20}),
							checkbox({
								icon:"star-o",
								text:"My value is: false",
								bgcolor:"transparent",
								borderwidth:0,
								textcolor:"white",
								textactivecolor:"pink",
								fontsize:30,
								pickalpha:-1,
								click:function(){
									this.icon = this.value ? "star" : "star-o";
									this.text = "My value is: " + this.value
								}
							})
						),
						view({ flexdirection:"column", flex:0 },
							label({text:"Background Image", marginbottom:20}),
							checkbox({
								icon:undefined,
								width:40,
								bgimage:"$resources/textures/purplecloud.png",
								bgimagemode:"stretch",
								click:function(){
									this.bgimage = this.value ? "$resources/textures/bluecloud.png" : "$resources/textures/purplecloud.png";
									this.find("status").text = "Value is: " + this.value
								}
							}),
							label({name:"status", text:"Value is: false", fontsize:12, margintop:5})
						)
					)
				)
			]
		}
	}
)
