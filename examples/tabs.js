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
						bgcolor:"#4e4e4e",
						gridsize:10,
						majorevery:5,
						majorline:vec4(0.34117648005485535,0.34117648005485535,0.34117648005485535,1),
						minorline:vec4(0.2823529541492462,0.2823529541492462,0.2823529541492462,1),
						alignself:'stretch',
						flexdirection:'row',
						alignitems:"center",
						justifycontent:'space-around'
					},
					view({
						flexdirection:"column",
						borderwidth:1,
						bordercolor:"black",
						bgcolor:vec4(0,0,0,0.2),
						width:300,
						height:500
					},
						view(
							{
								flex:1,
								padding:20,
								name:"main",
								alignitems:"center",
								justifycontent:"center"
							},
							label({name:"page", text:"On 'SMS' tab", bgcolor:NaN})
						),
						tabbar({
							style:{
								button:{
									paddingtop:10
								}
							},
							bgcolor:"transparent",
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
								var main = this.find("main");
								var label = main.find("page");
								label.text = "On '" + name + "' tab";
							}
						})
					),
					view({
							flexdirection:"column",
							borderwidth:1,
							bordercolor:"black",
							bgcolor:vec4(0,0,0,0.2),
							width:300,
							height:500
						},
						tabbar({
							style:{
								button:{
									arrowtop:false,
									paddingbottom:10
								}
							},
							bgcolor:"transparent",
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
								var main = this.find("main");
								var label = main.find("page");
								label.text = "On '" + name + "' tab";
							}
						}),
						view(
							{
								flex:1,
								padding:20,
								name:"main",
								alignitems:"center",
								justifycontent:"center"
							},
							label({name:"page", text:"On 'SMS' tab", bgcolor:NaN})
						)
					),
					view({
							flexdirection:"column",
							borderwidth:0,
							bordercolor:"black",
							width:300,
							height:500
						},
						tabbar({
							bgcolor:"transparent",
							tabclass:"folder",
							textcolor:"yellow",
							activetextcolor:"#222",
							tabs:[
								{
									name:"favorites",
									icon:"star",
									text:"Favorites",
									bgimage: require("$resources/textures/bluecloud.png"),
									padding:10,
									fontsize:15
								},
								{
									name:"bookmark",
									icon:"bookmark",
									text:"Bookmarks",
									bgimage: require("$resources/textures/purplecloud.png"),
									padding:10,
									fontsize:15
								}
							],
							onactivetab:function(ev,tabid,bar) {
								for (var i=0;i<bar.tabs.length;i++) {
									if (i != tabid) {
										bar.tabs[i].bgimage = require("$resources/textures/purplecloud.png")
									}
								}

								var tab = bar.tabs[tabid];
								tab.bgimage = require("$resources/textures/bluecloud.png");

								var name = tab.name;
								var tabpanel = this.find("tabpanel");
								var label = tabpanel.find("page");
								label.text = "On '" + name + "' tab";
							}
						}),
						view(
							{
								flex:1,
								padding:20,
								name:"tabpanel",
								bgcolor:vec4(0,0,0,0.2),
								alignitems:"center",
								justifycontent:"center"
							},
							label({name:"page", text:"On 'favorites' tab", bgcolor:NaN})
						)
					)

				)
			)
		]
	}
}
)
