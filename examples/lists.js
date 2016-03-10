/* DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); You may not use this file except in compliance with the License.
 You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.*/

define.class("$server/composition",function(require,$ui$,textbox,checkbox,icon,button,label,view,screen,cadgrid,$widgets$,toolkit){

		this.render=function(){

			return [
				screen(
					{
						flexdirection:"row"
					},
					cadgrid({
							name:"grid",
							flex:3,
							overflow:"scroll",
							bgcolor:vec4(0.08853328227996826,0.11556218564510345,0.16508188843727112,1),
							gridsize:8,
							majorevery:5,
							majorline:vec4(0.0,0.26,0.34,1),
							minorline:vec4(0.15,0.15,0.12,1),
							flexdirection:'row',
							alignitems:'center',
							justifycontent:'space-around'
					},
						view({flexdirection:"column"},
							label({ text:"Vertical List",  marginbottom:20 }),
							view({
									name:"simple",
									flex:0,
									width:100,
									height:150,
									bgcolor:"black",
									overflow:"vscroll",
									flexdirection:"column"
								},
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"Some text"}),
								label({text:"MORE TEXT"}),
								label({text:"More text"}),
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"MORE TEXT"}),
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"Even more text!"})
							)
						),
						view({flexdirection:"column"},
							label({ text:"Horizontal List",  marginbottom:20 }),
							view({
									name:"simple",
									flex:0,
									width:100,
									height:50,
									bgcolor:"black",
									overflow:"hscroll",
									flexdirection:"row"
								},
								icon({icon:"check"}),
								icon({icon:"star"}),
								icon({icon:"star"}),
								icon({icon:"star-o"}),
								icon({icon:"check"}),
								icon({icon:"star"}),
								icon({icon:"star"}),
								icon({icon:"star-o"}),
								icon({icon:"check"}),
								icon({icon:"star"}),
								icon({icon:"star"}),
								icon({icon:"star-o"}),
								icon({icon:"times"})
							)
						),
						view({flexdirection:"column"},
							label({
								text:"Adjust scroll position programatically",
								marginbottom:20
							}),

							view({marginbottom:20},
								button({
									text:"Up",
									click:function() {
										var box = this.find("smallbox");
										box.scroll = vec2(box.scroll[0], box.scroll[1] + 10);
										box.redraw()
									}
								}),
								button({
									text:"Down",
									marginleft:5,
									click:function() {
										var box = this.find("smallbox");
										box.scroll = vec2(box.scroll[0], box.scroll[1] - 10);
										box.redraw()
									}
								}),
								button({
									text:"Left",
									marginleft:5,
									click:function() {
										var box = this.find("smallbox");
										box.scroll = vec2(box.scroll[0] + 10, box.scroll[1]);
										box.redraw()
									}
								}),
								button({
									text:"Right",
									marginleft:5,
									click:function() {
										var box = this.find("smallbox");
										box.scroll = vec2(box.scroll[0] - 10, box.scroll[1]);
										box.redraw()
									}
								})
							),

							view({
									name:"smallbox",
									flex:0,
									width:100,
									height:150,
									bgcolor:"black",
									overflow:"hidden",
									flexdirection:"column"
								},
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"MORE TEXT"}),
								label({text:"More text"}),
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"MORE TEXT"}),
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"Some text"}),
								label({text:"More text"}),
								label({text:"Even more text!"})
							)
						)
					)
				)
			]
		}
	}
);
