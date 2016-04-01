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
						view({margintop:20, justifycontent:"space-around", padding:30},
							label({text:"Static text label"}),
							label({text:"Multiline\nLabel", multiline:true}),
							label({text:"Styled Label", fontsize:100, fgcolor:"red", bgcolor:"white", borderradius:10}),
							label({text:"Label With BG Image", padding:10, fgcolor:"black", bgimage:"$resources/textures/bluecloud.png", bgimagemode:"stretch"})
						),
						view({margintop:20, justifycontent:"space-around", padding:30},
							textbox({
								borderwidth:1,
								paddingleft:10,
								bordercolor:"white",
								fgcolor:"black",
								cursorcolor:"red",
								value:"Text field without fixed size (expands)"
							}),
							textbox({
								paddingleft:10,
								fgcolor:"black",
								bgcolor:"white",
								value:"Multiline\ntext\nfield\nMultiline text\nfield\ntext\nMultiline field\ntext\nMultiline field text\nfield",
								multiline:true
							}),
							view({
								flexdirection:"column"
							},
								label({text:"With overflow='hidden':"}),
								textbox({
									borderwidth:1,
									paddingleft:10,
									bordercolor:"white",
									fgcolor:"white",
									flex:1,
									width:100,
									bgcolor:vec4(0.7,0.7,0.7,0.7),
									overflow:"hidden",
									cursorcolor:"red",
									value:"Fixed size text field with overflow hidden",
									marginbottom:10,
									margintop:10
								}),
								textbox({
									borderwidth:1,
									paddingleft:10,
									bordercolor:"white",
									fgcolor:"white",
									bgcolor:vec3(0.7,0.7,0.7),
									flex:1,
									width:100,
									cursorcolor:"red",
									value:"Fixed size without overflow:hidden"
								})
							),
							textbox({
								borderwidth:1,
								paddingleft:10,
								bordercolor:"white",
								bgimage:"$resources/textures/purplecloud.png",
								bgimagemode:"stretch",
								value:"Text field w/bg image"
							})
						)
					)
				)
			]
		}
	}
)
