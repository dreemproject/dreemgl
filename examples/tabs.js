/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require, $ui$, tabbar, screen, label, view, cadgrid, $widgets$, toolkit) {

	this.render = function() {
		return [
			screen(
				cadgrid({
						name:"grid",
						flex:3,
						bgcolor:"#4e4e4e",
						gridsize:8,
						majorevery:5,
						majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1),
						minorline:vec4(0.2823529541492462,0.2823529541492462,0.2823529541492462,1),
						alignitems:'stretch',
						alignself:'stretch',
						flexdirection:'column',
						justifycontent:'flex-end'
					},
					view(
						{
							flex:1,
							name:"main",
							bgcolor:NaN,
							alignitems:"center",
							justifycontent:"center"
						},
						label({name:"page", text:"", bgcolor:NaN})
					),
					tabbar({
						activetabcolor:"#333",
						activetextcolor:"#2aa",
						tabs:[
							{
								name:"SMS",
								icon:"comment",
								boldness:0.3,
								fontsize:33
							},
							{
								name:"inbox",
								icon:"envelope",
								boldness:0.3,
								fontsize:33
							},
							{
								name:"contacts",
								icon:"at",
								fontsize:33,
								boldness:0.15
							},
							{
								name:"search",
								icon:"search",
								fontsize:33
							},
							{
								name:"more",
								icon:"ellipsis-h",
								fontsize:33,
								boldness:0
							}
						],
						onactivetab:function(ev,tab,bar) {
							var name = bar.tabs[tab].name
							var main = this.screen.find("main");
							var label = main.find("page");
							label.text = "Select '" + name + "' tab";
						}
					})
				)
			)
		]
	}
}
)
