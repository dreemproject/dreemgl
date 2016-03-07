/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require, $ui$, screen, cadgrid, view, label, icon, textbox) {

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
							flexdirection:'column',
							alignitems:"stretch",
							justifycontent:'space-around'
						},
						view({justifycontent:"space-around", padding:30},
							icon({
								icon:"gear",
								fgcolor:"lightblue",
								fontsize:140
							}),
							icon({
								icon:"gear",
								boldness:1.0,
								fgcolor:"lightblue",
								fontsize:140
							}),
							icon({
								icon:"flask",
								borderradius:20,
								bgimagemode:"stretch",
								bgimage:"$resources/textures/purplecloud.png",
								fontsize:60
							}),
							icon({
								icon:"star",
								fontsize:60,
								typefacenormal:{
									textpixel:function() {
										return vec4(1,0,0,0)
									}
								}
							}),
							icon({
								icon:"star-o",
								fgcolor:"yellow",
								fontsize:40
							})
						),
						view({margintop:20, justifycontent:"space-around", padding:30},
							textbox({
								borderwidth:1,
								paddingleft:10,
								bordercolor:"white",
								fgcolor:"black",
								cursorcolor:"red",
								value:"Input text box"
							}),
							textbox({
								paddingleft:10,
								fgcolor:"black",
								bgcolor:"white",
								value:"Multuline\nInput\ntext",
								multiline:true
							}),
							textbox({
								borderwidth:1,
								paddingleft:10,
								bordercolor:"white",
								bgimage:"$resources/textures/purplecloud.png",
								bgimagemode:"stretch",
								value:"Input text box w/bg image"
							})
						),
						view({margintop:20, justifycontent:"space-around", padding:30},
							label({text:"Basic Label"}),
							label({text:"Multiline\nLabel", multiline:true}),
							label({text:"Styled", fontsize:100, fgcolor:"red", bgcolor:"white", borderradius:10}),
							label({text:"BG Image", padding:10, fgcolor:"black", bgimage:"$resources/textures/bluecloud.png", bgimagemode:"stretch"})
						)
					)
				)
			]
		}
	}
)
