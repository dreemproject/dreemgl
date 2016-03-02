/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require, $ui$, checkbox, icon, button, drawer, label, view, screen, cadgrid, $widgets$, toolkit) {

	this.render = function() {
		return [
			screen(
				{flexdirection:"row"},
				cadgrid({
						name:"grid",
						flex:3,
						overflow:"scroll",
						bgcolor:vec4(0.08853328227996826,0.11556218564510345,0.16508188843727112,1),
						gridsize:8,
						majorevery:5,
						majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1),
						minorline:vec4(0.17135260999202728,0.17135260999202728,0.17135260999202728,1),
						alignitems:'center',
						alignself:'stretch',
						flexdirection:'column',
						justifycontent:'space-around',
						anchor:vec3(0,0,0),
						toolmove:false,
						toolrect:false
					},
					drawer(
						{
							flex:0,
							width:200,
							height:60,
							min:-0.65,
							max:0.6
						},
						view({flex:1, bgcolor:"gray", alignitems:"center", justifycontent:"center"},
							label({text:"< Double Drawer >"})),
						view({bgcolor:"yellow", flex:1, alignitems:"center", justifycontent:"flex-end"},
							label({text:"Right Tray", fgcolor:"purple", fontsize:24, marginright:10})),
						view({bgcolor:"purple", flex:1, alignitems:"center"},
							label({text:"Left Tray", fgcolor:"yellow", fontsize:24, marginleft:10}))
					),

					drawer(
						{
							flex:0,
							width:200,
							height:60,
							min:-0.66
						},
						view({flex:1, bgcolor:"blue", alignitems:"center", justifycontent:"center"},
							label({text:"Drawer >"})),
						view({bgcolor:"yellow", flex:1, alignitems:"center", justifycontent:"flex-end"},
							label({text:"Right Only", fgcolor:"red", fontsize:24, marginright:10}))
					)
				),
				toolkit({visible:false, position:"absolute", x:781, y:90.99999237060547, width:400, height:800})
			)
		]
	}
}
)
